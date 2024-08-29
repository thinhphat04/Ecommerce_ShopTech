const ChatMessageService = require('../services/ChatMessageService');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
  ws.on('message', async (message) => {
    try {
      const chatMessage = JSON.parse(message);
      const savedMsg = await ChatMessageService.saveMessage(chatMessage);

      // Gửi tin nhắn tới người nhận qua WebSocket
      const recipientSocket = Array.from(wss.clients).find(client => client.userId === savedMsg.recipientId);
      if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
        recipientSocket.send(JSON.stringify({
          id: savedMsg._id,
          senderId: savedMsg.senderId,
          recipientId: savedMsg.recipientId,
          content: savedMsg.content
        }));
      }
      console.log('Received and saved message:', chatMessage);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // Giả sử bạn có cơ chế để gán userId cho mỗi kết nối
  ws.userId = req.headers['user-id']; // Cần phải được thiết lập trong khi kết nối
});

module.exports = {
  wss
};
