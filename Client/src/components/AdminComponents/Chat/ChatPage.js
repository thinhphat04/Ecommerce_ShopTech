import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const authAdmin = JSON.parse(window.localStorage.getItem('authAdmin')); // Thay thế bằng authAdmin
  const senderId = authAdmin?._id; // Thay bằng adminId của bạn

  useEffect(() => {
    // Load chat history first
    fetchChatHistory();

    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:3555'); // Đảm bảo URL WebSocket đúng

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log('Message received:', receivedMessage);
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId, senderId]);

  const fetchChatHistory = async () => {
    try {
      const authToken = localStorage.getItem('authToken'); // Hoặc cách khác bạn lưu token
      const response = await axios.get(`http://localhost:3555/api/v1/messages/${senderId}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${authAdmin.accessToken}`, 
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const sendMessage = () => {
    if (socket && newMessage.trim() !== '') {
      const messageToSend = {
        chatId: `${senderId}_${userId}`,
        senderId: senderId,
        recipientId: userId,
        content: newMessage,
        timestamp: new Date().toISOString(), // Đảm bảo có timestamp
      };

      setMessages(prevMessages => [...prevMessages, messageToSend]);
      socket.send(JSON.stringify(messageToSend));
      setNewMessage(''); // Reset the message input after sending
    }
  };

  return (
    <div id="chat-container">
      <div id="chat-header">
        <h2>Chat with {userId}</h2>
      </div>
      <div id="chat-message-area" style={{ height: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === senderId ? 'sent' : 'received'}`}>
            <p>{msg.content}</p>
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div id="chat-input-area">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
