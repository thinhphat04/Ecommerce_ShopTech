import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../Common/AdminSidebar';
import axios from 'axios';
import './ListCustomers.css'; // Import the CSS file

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
        const filteredUsers = response.data.filter(user => !user.isAdmin);
        setUsers(filteredUsers);
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

  // const handleSupportClick = (userId) => {
  //   navigate(`/admin/chat/${userId}`);
  // };

  return (
    <>
      <AdminSidebar />
      <div id="admin-box" className="list-customers-container">
        <h2 className="list-customers-title">Customer List</h2>
        <ul className="list-customers-list">
          {users.map((user) => (
            <li key={user._id} className="list-customers-item">
              <span className="list-customers-name">{user.name}</span>
              <button 
                className="list-customers-support-btn"
                onClick={() => handleSupportClick(user._id)}
              >
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
