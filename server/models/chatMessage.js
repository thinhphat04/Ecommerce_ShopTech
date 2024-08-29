const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  chatId: String,
  senderId: String,
  recipientId: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
