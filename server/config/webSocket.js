const WebSocket = require('ws');
const ChatMessageService = require('../services/ChatMessageService');

const isJSON = (string) => {
  try {
    JSON.parse(string);
    return true;
  } catch (e) {
    return false;
  }
};

const initWebSocketServer = () => {
  const wss = new WebSocket.Server({ port: 8000 });
  const clients = new Map(); // Để theo dõi các client đã kết nối

  wss.on('connection', (ws, req) => {
    const userId = new URLSearchParams(req.url.split('?')[1]).get('userId'); // Lấy userId từ query string
    console.log(`User connected: ${userId}`);
    clients.set(userId, ws);

    ws.on('message', async (message) => {
      console.log('Received message:', message);
    
      if (isJSON(message)) {
        const { chatId, recipientId, senderId, content, timestamp } = JSON.parse(message);
        console.log('Parsed message:', { chatId, recipientId, senderId, content, timestamp });
    
        const recipient = clients.get(recipientId);
        if (recipient && recipient.readyState === WebSocket.OPEN) {
          const messageToSend = {
            chatId,
            senderId,
            recipientId,
            content,
            timestamp: new Date().toISOString(),
          };
    
          recipient.send(JSON.stringify(messageToSend));
          console.log('Message sent to recipient:', messageToSend);
           await ChatMessageService.saveMessage(messageToSend);

        } else {
          console.log(`Recipient ${recipientId} not connected`);
        }
      } else {
        console.log('Invalid JSON message:', message);
      }
    });

    ws.on('close', () => {
      console.log(`User disconnected: ${userId}`);
      clients.delete(userId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
    });
  });

  console.log('WebSocket server is running on ws://localhost:8000');
};

module.exports = initWebSocketServer;
