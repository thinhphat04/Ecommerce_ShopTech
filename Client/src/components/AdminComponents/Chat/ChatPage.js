import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ChatPage.css';

const ChatPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Use navigate for navigation

  const authAdmin = JSON.parse(window.localStorage.getItem('authAdmin'));
  const senderId = authAdmin?._id;

  useEffect(() => {
    fetchUserName();
    fetchChatHistory();

    const wsUrl = `ws://localhost:8000?userId=${senderId}`;
    const ws = new WebSocket(wsUrl);
    console.log(`Attempting to connect to WebSocket at: ${wsUrl}`);
    ws.onopen = () => {
      console.log(`Connected to WebSocket at: ${wsUrl} as user: ${senderId}`);
    };

    ws.onmessage = (event) => {
      const result = JSON.parse(event.data);
      const { senderId, content, timestamp } = result;
      console.log('Message received:', result);
      setMessages(prevMessages => [...prevMessages, { senderId, content, timestamp }]);
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

  const fetchUserName = async () => {
    try {
      const response = await axios.get(`http://localhost:3555/api/v1/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${authAdmin.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setUserName(response.data.name);
      }
    } catch (error) {
      console.error('Failed to fetch user name:', error);
    }
  };
  

  const fetchChatHistory = async () => {
    try {
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

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div id="chat-container">
      <div id="chat-header">
        <button id="back-button" onClick={handleBack}>Back</button>
        <h2>Chat with {userName}</h2>
      </div>
      <div id="chat-message-area">
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
