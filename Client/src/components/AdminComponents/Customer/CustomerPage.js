import React, { useState, useEffect } from 'react';
import './styles/customer-style.css';
import AdminHeader from '../Common/AdminHeader';
import AdminSidebar, { handleLoadOptionSelected } from '../Common/AdminSidebar';
import EditButtonCustomer from '../../EditButton/EditButtonCustomer';

const CustomerPage = () => {
  const [users, setUsers] = useState([]);
  const [countCustomer, setCountCustomers] = useState(0);

  const [loading, setLoading] = useState(true);
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));

 console.log('authAdmin.accessToken:::', authAdmin.accessToken)
  useEffect(() => {
    document.title = 'ShopTECH | Khách hàng';
    const fetchAPI = () => {
      fetch('http://localhost:3555/api/v1/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authAdmin.accessToken}` , 
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        console.log('res::', res)
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
        setCountCustomers(data.length);
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
    };
    
    fetchAPI();
    handleLoadOptionSelected(1);
  }, []);

  return (
    <div className="customer__container">
      <AdminSidebar />
      <div id="admin-box">
        <AdminHeader />
        <div className="admin__title">
          <label className="admin__tilte-label">
            Have a nice day, admin!
          </label>
          <label className="admin__tilte-describe">
          Customer management page
          </label>
        </div>
        <div className="customer__group">
          <div className="customer__header">
            <label className="customer__header-title">
            Customer list
            </label>
            <div className="customer__header-counting">
            Number of customers:
              <span className="customer__header-counting-number">
                {countCustomer}
              </span>
            </div>
          </div>

          <div className="customer__table-cover">
            <table className="table">
              <thead>
                <tr className="table__thead-primary">
                  <td>No</td>
                  <td>Account name</td>
                  <td>Customer's full name</td>
                  <td>Email</td>
                  <td>Phone</td>
                  {/* <td>Địa chỉ</td> */}
                  {/* <td>Chỉnh sửa</td> */}
                </tr>
              </thead>
              <tbody className="table__tbody-primary">
                {loading ? (
                  <tr>
                    <td>Loading...</td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr className="table__row-loading" key={index}>
                      <td
                        style={{
                          textAlign: 'center',
                          background: '#ffcdd2',
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </td>
                      <td style={{ color: 'red', fontWeight: 700 }}>
                        {user.name}
                      </td>
                      <td
                        style={{
                          textAlign: 'left',
                          backgroundColor: 'var(--primary-color',
                          fontWeight: 700,
                          color: 'white',
                        }}
                      >
                        {user.name}
                      </td>
                      <td style={{ textAlign: 'left' }}>
                        {user.email || 'None'}
                      </td>
                      <td style={{ backgroundColor: '#fff2c1' }}>
                        {user.phone || 'None'}
                      </td>
                      {/* <td style={{ textAlign: 'left' }}>
                        {user.address || 'None'}
                      </td> */}
                      {/* <td>
                        <div className="table__edit-btn">
                          {<EditButtonCustomer user={user} />}
                        </div>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
