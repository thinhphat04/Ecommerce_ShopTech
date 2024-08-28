const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  users: { type: [String], required: true }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);