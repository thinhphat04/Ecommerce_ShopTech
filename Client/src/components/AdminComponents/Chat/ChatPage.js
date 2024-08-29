import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const authAdmin = JSON.parse(window.localStorage.getItem('authAdmin'));
  const senderId = authAdmin?._id;

  useEffect(() => {
    // Load chat history first
    fetchChatHistory();

    // Connect to WebSocket
    const wsUrl = `ws://localhost:8000?userId=${senderId}`; // Địa chỉ IP của máy chủ
    const ws = new WebSocket(wsUrl);
    console.log(`Attempting to connect to WebSocket at: ${wsUrl}`);
    ws.onopen = () => {
      console.log(`Connected to WebSocket at: ${wsUrl} as user: ${senderId}`);
    };


    ws.onmessage = (event) => {
      const result = JSON.parse(event.data);
      const { chatId, senderId, recipientId, content, timestamp }  = result;
      console.log('Message received:', result);
      setMessages(prevMessages => [...prevMessages, {
        senderId, // Người gửi
        content,  // Nội dung tin nhắn
        timestamp // Thời gian nhận tin nhắn
      }]);
    };

    ws.onclose = () => {
      console.log(`Disconnected from WebSocket at: ${wsUrl}`);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error: ${error.message}`);
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [userId, senderId]);

  const fetchChatHistory = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
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
    if (socket && socket.readyState === WebSocket.OPEN && newMessage.trim() !== '') {
      const messageToSend = {
        chatId: `${senderId}_${userId}`,
        senderId: senderId,
        recipientId: userId,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages(prevMessages => [...prevMessages, messageToSend]);
      socket.send(JSON.stringify(messageToSend));
      console.log('Message sent:', messageToSend);
      setNewMessage('');
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
