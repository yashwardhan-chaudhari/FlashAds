import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * @desc    Send a message to another user
 * @route   POST /api/messages
 * @access  Private
 */
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, text, boardId } = req.body;

    if (!recipientId || !text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and message text are required',
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found',
      });
    }

    const message = new Message({
      senderId: req.user._id,
      recipientId,
      boardId: boardId || null,
      text: text.trim(),
    });

    await message.save();

    // Trigger Notification for recipient (Phase 19)
    await Notification.create({
      recipientId,
      senderId: req.user._id,
      type: 'new_message',
      title: 'New Message Received',
      message: `${req.user.name}: "${text.length > 50 ? text.slice(0, 50) + '...' : text}"`,
      link: '/messages',
    });

    const populated = await Message.findById(message._id)
      .populate('senderId', 'name email role')
      .populate('recipientId', 'name email role');

    return res.status(201).json({
      success: true,
      message: populated,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error sending message',
    });
  }
};

/**
 * @desc    Get conversation history with a specific user
 * @route   GET /api/messages/conversation/:userId
 * @access  Private
 */
export const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: currentUserId },
      ],
    })
      .populate('senderId', 'name email role')
      .populate('recipientId', 'name email role')
      .sort({ createdAt: 1 });

    // Mark messages sent to current user as read
    await Message.updateMany(
      { senderId: otherUserId, recipientId: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving conversation',
    });
  }
};

/**
 * @desc    Get list of all conversations for current user
 * @route   GET /api/messages/conversations
 * @access  Private
 */
export const getConversationsList = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Aggregate latest message per conversation partner
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { recipientId: currentUserId }],
    })
      .populate('senderId', 'name email role')
      .populate('recipientId', 'name email role')
      .sort({ createdAt: -1 });

    const partnersMap = new Map();

    for (const msg of messages) {
      const isMeSender = msg.senderId._id.toString() === currentUserId.toString();
      const partner = isMeSender ? msg.recipientId : msg.senderId;
      const partnerId = partner._id.toString();

      if (!partnersMap.has(partnerId)) {
        partnersMap.set(partnerId, {
          partner,
          lastMessage: msg,
          unreadCount: !isMeSender && !msg.isRead ? 1 : 0,
        });
      } else if (!isMeSender && !msg.isRead) {
        partnersMap.get(partnerId).unreadCount += 1;
      }
    }

    return res.status(200).json({
      success: true,
      conversations: Array.from(partnersMap.values()),
    });
  } catch (error) {
    console.error('Get conversations list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving conversations list',
    });
  }
};
