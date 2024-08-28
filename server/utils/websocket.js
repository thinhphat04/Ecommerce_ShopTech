const WebSocket = require('ws');

// Khởi tạo WebSocket server với HTTP server hiện tại
const initializeWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('message', (message) => {
            console.log('Received:', message);
            // Xử lý tin nhắn từ client tại đây
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
};

module.exports = initializeWebSocket;
