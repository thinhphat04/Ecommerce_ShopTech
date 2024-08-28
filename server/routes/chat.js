const express = require('express');
const ChatMessage = require('../models/chatMessage');
const ChatRoom = require('../models/chatRoom');
const router = express.Router();

// Tạo hoặc lấy phòng chat
async function getChatRoomId(senderId, recipientId) {
    const users = [senderId, recipientId].sort();
    let chatRoom = await ChatRoom.findOne({ users });
    if (!chatRoom) {
        chatRoom = await ChatRoom.create({ chatId: `${users[0]}_${users[1]}`, users });
    }
    return chatRoom.chatId;
}

// Gửi tin nhắn
router.post('/messages', async (req, res) => {
    const { senderId, recipientId, content } = req.body;

    if (!senderId || !recipientId || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const chatId = await getChatRoomId(senderId, recipientId);
        const newMessage = await ChatMessage.create({ chatId, senderId, recipientId, content });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy lịch sử tin nhắn
router.get('/messages/:senderId/:recipientId', async (req, res) => {
    const { senderId, recipientId } = req.params;

    if (!senderId || !recipientId) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const chatId = await getChatRoomId(senderId, recipientId);
        const messages = await ChatMessage.find({ chatId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;