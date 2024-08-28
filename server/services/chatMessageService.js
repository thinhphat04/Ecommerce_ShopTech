const ChatMessage = require('../models/chatMessage');

const saveMessage = async (chatMessage) => {
  try {
    const savedMessage = await ChatMessage.create(chatMessage);
    return savedMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

module.exports = { saveMessage };
