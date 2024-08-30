import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../Common/AdminSidebar';
import axios from 'axios';

const ListCustomers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const authAdmin = JSON.parse(window.localStorage.getItem('authAdmin'));
  const adminId = authAdmin.userId; // Giả sử adminId có trong authAdmin

  const fetchChatHistory = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3555/api/v1/messages/${adminId}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${authAdmin.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response && response.data) {
        return response.data;
      } else {
        console.warn('No messages found');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      return [];
    }
  };

  const checkLastMessageSender = async (userId) => {
    const chatHistory = await fetchChatHistory(userId);

    if (chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      return lastMessage.senderId === userId;
    }

    return false;
  };

  const fetchUsersData = async () => {
    try {
      const response = await axios.get('http://localhost:3555/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${authAdmin.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response && response.data) {
        const usersWithMessageCheck = await Promise.all(
          response.data
            .filter(user => !user.isAdmin)
            .map(async (user) => {
              const isUserSender = await checkLastMessageSender(user._id);
              return { ...user, isUserSender };
            })
        );

        setUsers(usersWithMessageCheck);
      } else {
        console.warn('No users found or no response data');
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSupportClick = (userId) => {
    navigate(`/admin/chat/${userId}`);
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  return (
    <>
      <AdminSidebar />
      <div id="admin-box">
        <h2>User List</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id} style={{ marginBottom: '10px' }}>
              {user.name}
              {user.isUserSender ? (
                <span style={{ color: 'green', marginLeft: '10px' }}>User sent last message</span>
              ) : (
                <span style={{ color: 'red', marginLeft: '10px' }}>Admin sent last message</span>
              )}
              <button onClick={() => handleSupportClick(user._id)} style={{ marginLeft: '10px' }}>
                Support
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ListCustomers;
