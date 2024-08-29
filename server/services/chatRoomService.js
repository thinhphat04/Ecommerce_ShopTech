// services/ChatRoomService.js
const ChatRoom = require('../models/ChatRoom');

class ChatRoomService {
  async getChatRoomId(senderId, recipientId, createNewRoomIfNotExist = false) {
    let chatRoom = await ChatRoom.findOne({ senderId, recipientId });
    if (chatRoom) return chatRoom.chatId;

    if (createNewRoomIfNotExist) {
      const chatId = `${senderId}_${recipientId}`;
      const senderRecipient = new ChatRoom({ chatId, senderId, recipientId });
      const recipientSender = new ChatRoom({ chatId, senderId: recipientId, recipientId: senderId });

      await senderRecipient.save();
      await recipientSender.save();

      return chatId;
    }

    return null;
  }
}

module.exports = new ChatRoomService();
