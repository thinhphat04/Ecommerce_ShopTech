// services/ChatMessageService.js
const ChatMessage = require('../models/ChatMessage');
const ChatRoomService = require('./ChatRoomService');

class ChatMessageService {
  async saveMessage(chatMessage) {
    try {
        
    
    const chatId = await ChatRoomService.getChatRoomId(chatMessage.senderId, chatMessage.recipientId, true);
    chatMessage.chatId = chatId;
    const savedMessage = await new ChatMessage(chatMessage).save();
    console.log('Message saved:', savedMessage);
    return savedMessage;
} catch (error) {
    console.error('Error saving message:', error);
}
  }

  async findChatMessages(senderId, recipientId) {
    const chatId = await ChatRoomService.getChatRoomId(senderId, recipientId, false);
    if (!chatId) return [];

    return await ChatMessage.find({ chatId }).sort({ timestamp: -1 });
  }
}

module.exports = new ChatMessageService();
