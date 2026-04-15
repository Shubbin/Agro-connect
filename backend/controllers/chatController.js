import Message from '../models/Message.js';
import User from '../models/User.js';

const getUserIdFromToken = async (req) => {
  const auth = req.headers.authorization ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/);
  if (!match) return null;

  try {
    const user = await User.findOne({ auth_token: match[1] });
    return user ? user._id : null;
  } catch (err) {
    console.error('getUserIdFromToken error:', err);
    return null;
  }
};

export const getMessages = async (req, res) => {
  const conversationId = req.query.conversationId;
  if (!conversationId) return res.json([]);

  const parts = conversationId.split('_');
  if (parts.length < 2) return res.json([]);

  const [id1, id2] = parts;

  try {
    const messages = await Message.find({
      $or: [
        { sender: id1, receiver: id2 },
        { sender: id2, receiver: id1 }
      ]
    })
    .sort({ timestamp: 1 })
    .populate('sender', 'name');

    const formatted = messages.map(m => {
      const doc = m.toObject();
      return {
        ...doc,
        id: doc._id,
        senderName: doc.sender?.name
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error('Get messages error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req, res) => {
  const { receiverId, content = '', productId = null, mediaUrl = null, mediaType = null, senderId: inputSenderId } = req.body;
  const senderId = (await getUserIdFromToken(req)) ?? inputSenderId ?? null;

  const trimmedContent = content.trim();

  if (!senderId || !receiverId || (!trimmedContent && !mediaUrl)) {
    return res.status(400).json({ error: 'senderId, receiverId and (content or media) are required' });
  }

  try {
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: trimmedContent,
      product: productId,
      media_url: mediaUrl,
      media_type: mediaType
    });

    const populated = await message.populate('sender', 'name');
    const doc = populated.toObject();

    return res.json({
      ...doc,
      id: doc._id,
      senderName: doc.sender?.name
    });
  } catch (err) {
    console.error('Send message error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getConversations = async (req, res) => {
  const userId = (await getUserIdFromToken(req)) ?? req.query.userId;
  if (!userId) return res.json([]);

  try {
    // Basic aggregation to find unique conversation partners
    const partners = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: { $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"] },
          lastMessage: { $first: "$content" },
          last_ts: { $first: "$timestamp" },
          unread: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiver", userId] }, { $eq: ["$is_read", false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { last_ts: -1 } }
    ]);

    const conversations = await Promise.all(partners.map(async (row) => {
      const partner = await User.findById(row._id).select('name role is_verified');
      if (!partner) return null;

      return {
        id: `${userId}_${row._id}`,
        participantId: row._id,
        participantName: partner.name,
        participantRole: partner.role,
        isVerified: Boolean(partner.is_verified),
        lastMessage: row.lastMessage ?? '',
        unread: Number(row.unread ?? 0),
        timestamp: row.last_ts,
      };
    }));

    return res.json(conversations.filter(Boolean));
  } catch (err) {
    console.error('Get conversations error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find({ role: 'farmer' }).select('id name role is_verified verification_status');
    const formatted = users.map(u => ({
      ...u.toObject(),
      id: u._id
    }));
    return res.json(formatted);
  } catch (err) {
    console.error('Get chat users error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


