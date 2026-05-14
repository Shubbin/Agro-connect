import Message from '../models/Message.js';
import User from '../models/User.js';

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
    }).populate('sender', 'name').sort({ timestamp: 1 });

    const formatted = messages.map(m => ({
      ...m.toObject(),
      senderName: m.sender?.name
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req, res) => {
  const { receiverId, content = '', productId = null, mediaUrl = null, mediaType = null } = req.body;
  const senderId = req.user?._id;

  try {
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      product: productId,
      media_url: mediaUrl,
      media_type: mediaType
    });

    await message.save();
    const populated = await Message.findById(message._id).populate('sender', 'name');

    return res.json({
      ...populated.toObject(),
      senderName: populated.sender?.name
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getConversations = async (req, res) => {
  const userId = req.user?._id;
  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).populate('sender', 'name role is_verified').populate('receiver', 'name role is_verified').sort({ timestamp: -1 });

    const conversationsMap = new Map();

    messages.forEach(m => {
      const partner = m.sender._id.toString() === userId.toString() ? m.receiver : m.sender;
      if (!partner) return;

      if (!conversationsMap.has(partner._id.toString())) {
        conversationsMap.set(partner._id.toString(), {
          id: `${userId}_${partner._id}`,
          participantId: partner._id,
          participantName: partner.name,
          participantRole: partner.role,
          isVerified: partner.is_verified,
          lastMessage: m.content,
          unread: (!m.is_read && m.receiver._id.toString() === userId.toString()) ? 1 : 0,
          timestamp: m.timestamp
        });
      }
    });

    return res.json(Array.from(conversationsMap.values()));
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find({ role: 'farmer' }).select('name role is_verified');
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
