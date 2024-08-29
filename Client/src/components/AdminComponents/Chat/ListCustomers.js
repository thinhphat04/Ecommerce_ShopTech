import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thay useHistory bằng useNavigate
import AdminSidebar from '../Common/AdminSidebar';
import axios from 'axios';

const ListCustomers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Thay history bằng navigate

  const authAdmin = JSON.parse(window.localStorage.getItem('authAdmin'));

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
        // Cập nhật state với danh sách user từ API
        setUsers(filteredUsers);
      } else {
        console.warn('No users found or no response data');
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleSupportClick = (userId) => {
    // Điều hướng tới trang chat với id của user được chọn
    navigate(`/admin/chat/${userId}`); // Thay history.push bằng navigate
  };

  return (
    <>
      <AdminSidebar />
      <div id="admin-box">
        <h2>User List</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id} style={{ marginBottom: '10px' }}>
              {user.name}
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
