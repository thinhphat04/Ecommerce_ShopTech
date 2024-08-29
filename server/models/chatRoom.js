// models/ChatRoom.js
const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  chatId: String,
  senderId: String,
  recipientId: String
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
