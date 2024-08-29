const WebSocket = require('ws');
const ChatMessageService = require('../services/ChatMessageService'); // Đảm bảo đường dẫn chính xác

const isJSON = (string) => {
  try {
    JSON.parse(string);
    return true;
  } catch (e) {
    return false;
  }
};

const initWebSocketServer = (httpServer) => {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', (ws, req) => {
    ws.on('message', async (message) => {
      try {
        let messageString;

        // Kiểm tra loại dữ liệu nhận được
        if (Buffer.isBuffer(message)) {
          // Nếu nhận được Buffer, chuyển đổi thành chuỗi
          messageString = message.toString();
        } else if (typeof message === 'string') {
          // Nếu nhận được chuỗi, sử dụng nó trực tiếp
          messageString = message;
        } else {
          throw new Error('Unexpected message format');
        }

        console.log('Message received (as string):', messageString);

        // Kiểm tra xem chuỗi có phải là JSON hợp lệ không
        if (isJSON(messageString)) {
          const chatMessage = JSON.parse(messageString);
          const savedMsg = await ChatMessageService.saveMessage(chatMessage);

          // Tìm kiếm và gửi tin nhắn đến người nhận
          const recipientSocket = Array.from(wss.clients).find(client => client.userId === savedMsg.recipientId);
          if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
            recipientSocket.send(JSON.stringify({
              id: savedMsg._id,
              senderId: savedMsg.senderId,
              recipientId: savedMsg.recipientId,
              content: savedMsg.content
            }));
          }
          console.log('Received message on Server:', chatMessage);
        } else {
          console.error('Received message is not valid JSON.');
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Khởi động WebSocket server
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      // Giả sử bạn lưu thông tin người dùng vào ws.userId
      ws.userId = request.headers['user-id'];
      wss.emit('connection', ws, request);
    });
  });

  return wss;
};

module.exports = initWebSocketServer;
