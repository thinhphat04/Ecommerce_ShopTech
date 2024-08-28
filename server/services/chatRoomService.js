const ChatRoom = require('../models/chatRoom');

const getChatRoomId = async (senderId, recipientId, createNewRoomIfNotExist) => {
  let chatRoom = await ChatRoom.findOne({ senderId, recipientId });
  if (!chatRoom && createNewRoomIfNotExist) {
    const chatId = `${senderId}_${recipientId}`;
    chatRoom = await ChatRoom.create({ chatId, senderId, recipientId });
    await ChatRoom.create({ chatId, senderId: recipientId, recipientId: senderId });
  }
  return chatRoom ? chatRoom.chatId : null;
};

module.exports = {
  getChatRoomId
};
