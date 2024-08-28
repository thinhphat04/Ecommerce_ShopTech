const chatMessageService = require('../services/chatMessageService');
const ChatNotification = require('../models/chatNotification');

const processMessage = async (req, res) => {
  const chatMessage = req.body;

  try {
    const savedMsg = await chatMessageService.saveMessage(chatMessage);

    // Send notification (example, can be adapted to your needs)
    const notification = new ChatNotification({
      senderId: savedMsg.senderId,
      recipientId: savedMsg.recipientId,
      content: savedMsg.content,
    });
    
    // Code to send notification to the recipient via WebSocket, etc.

    res.status(200).json(savedMsg);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process message' });
  }
};

const findChatMessages = async (req, res) => {
  const { senderId, recipientId } = req.params;

  try {
    const messages = await chatMessageService.findChatMessages(senderId, recipientId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load chat messages' });
  }
};

module.exports = {
  processMessage,
  findChatMessages
};
