import { supabase } from '../config/db.js';

// Redundant helper removed - we now use req.user from the protect middleware

export const getMessages = async (req, res) => {
  const conversationId = req.query.conversationId;
  if (!conversationId) return res.json([]);

  const parts = conversationId.split('_');
  if (parts.length < 2) return res.json([]);

  const [id1, id2] = parts;

  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, sender:users(name)')
      .or(`and(sender_id.eq.${id1},receiver_id.eq.${id2}),and(sender_id.eq.${id2},receiver_id.eq.${id1})`)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    const formatted = messages.map(m => ({
      ...m,
      senderName: m.sender?.name
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('Get messages error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req, res) => {
  const { receiverId, content = '', productId = null, mediaUrl = null, mediaType = null } = req.body;
  const senderId = req.user?.id;

  const trimmedContent = content.trim();

  if (!senderId || !receiverId || (!trimmedContent && !mediaUrl)) {
    return res.status(400).json({ error: 'senderId, receiverId and (content or media) are required' });
  }

  try {
    const { data: message, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        content: trimmedContent,
        product_id: productId,
        media_url: mediaUrl,
        media_type: mediaType
      }])
      .select('*, sender:users(name)')
      .single();

    if (error) throw error;

    return res.json({
      ...message,
      senderName: message.sender?.name
    });
  } catch (err) {
    console.error('Send message error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getConversations = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // In Supabase/Postgres, we can use a more complex query or a view
    // For MVP, we'll fetch all messages for the user and group them in JS
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, sender:users(id, name, role, is_verified), receiver:users(id, name, role, is_verified)')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    const conversationsMap = new Map();

    messages.forEach(m => {
      const partner = m.sender_id === userId ? m.receiver : m.sender;
      if (!partner) return;

      if (!conversationsMap.has(partner.id)) {
        conversationsMap.set(partner.id, {
          id: `${userId}_${partner.id}`,
          participantId: partner.id,
          participantName: partner.name,
          participantRole: partner.role,
          isVerified: Boolean(partner.is_verified),
          lastMessage: m.content,
          unread: (!m.is_read && m.receiver_id === userId) ? 1 : 0,
          timestamp: m.timestamp
        });
      } else {
        if (!m.is_read && m.receiver_id === userId) {
          conversationsMap.get(partner.id).unread += 1;
        }
      }
    });

    return res.json(Array.from(conversationsMap.values()));
  } catch (err) {
    console.error('Get conversations error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (_req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, role, is_verified, verification_status')
      .eq('role', 'farmer');

    if (error) throw error;
    return res.json(users);
  } catch (err) {
    console.error('Get chat users error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
