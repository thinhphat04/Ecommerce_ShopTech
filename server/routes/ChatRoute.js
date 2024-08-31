const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage'); // Model của tin nhắn

// Route để lấy lịch sử tin nhắn giữa hai người dùng
router.get('/:senderId/:recipientId', async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;
    // Tìm tất cả các tin nhắn giữa hai người dùng
    const messages = await ChatMessage.find({
      $or: [
        { senderId: senderId, recipientId: recipientId },
        { senderId: recipientId, recipientId: senderId }
      ]
    }).sort({ createdAt: 1 }); // Sắp xếp theo thứ tự thời gian

    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Failed to load chat history' });
  }
});


module.exports = router;
