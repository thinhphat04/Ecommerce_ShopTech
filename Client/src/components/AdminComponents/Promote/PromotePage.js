import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../Common/AdminHeader';

import AdminSidebar, { handleLoadOptionSelected } from '../Common/AdminSidebar';
import { handleLoadingPage } from '../../Common';
import EditButtonPromote from '../../EditButton/EditButtonPromote';
import Papa from 'papaparse';
import './styles/promote-style.css';

const PromotePage = () => {
  const [promotes, setPromotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const navigate = useNavigate();
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));

  useEffect(() => {
    const fetchAPI = () => {
      document.title = 'ShopTECH | Order Management';
      fetch(`http://localhost:3555/api/v1/admin/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authAdmin.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPromotes(data);
          setLoading(false);
        });
    };
    fetchAPI();
    handleLoadOptionSelected(4);
  }, []);

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(orderId)) {
        return prevSelectedOrders.filter((id) => id !== orderId);
      } else {
        return [...prevSelectedOrders, orderId];
      }
    });
  };

  const downloadSelectedCSV = () => {
    const filteredPromotes = promotes.filter((promote) =>
      selectedOrders.includes(promote._id)
    );
    
    const csvData = filteredPromotes.map((promote) => ({
      Status: promote.status,
      Username: promote.user ? promote.user.username || promote.user.name : 'No user data',
      'Order Date': new Date(promote.dateOrdered).toLocaleDateString(),
      'Order Time': new Date(promote.dateOrdered).toLocaleTimeString(),
      'Total Price': promote.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      'Postal Code': promote.postalCode,
      'Shipping Address': promote.shippingAddress1,
      Phone: promote.phone,
      'Order Items': promote.orderItems.map(item => `${item.productName} (x${item.quantity})`).join('\n'),
      'Item Details': promote.orderItems.map(item => `Name: ${item.productName}, Size: ${item.selectedSize || 'N/A'}, Color: ${item.selectedColour || 'N/A'}`).join('\n'),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'selected_orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPromotes = promotes.filter((promote) => {
    const matchesStatus =
      statusFilter === 'All' || promote.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearchTerm =
      promote.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promote.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promote.orderItems.some((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesStatus && matchesSearchTerm;
  });

  return (
    <>
      <AdminSidebar />
      <div id="admin-box">
        <AdminHeader />
        <div className="admin__title">
          <label className="admin__tilte-label">Good day, admin!</label>
          <label className="admin__tilte-describe">Order management page</label>
        </div>

        <div className="promote__group">
          <div className="promote__header">
            <label className="promote__header-title">List of orders</label>
          </div>

          <div className="search-filter-container">
            <input
              type="text"
              placeholder="Search by username or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <table className="table">
            <thead>
              <tr className="table__thead-primary">
                <td>Select</td>
                <td>Status</td>
                <td>Order Items</td>
                <td>Username</td>
                <td>Date Order</td>
                <td>Total price</td>
                <td>Postal code</td>
                <td>Address</td>
                <td>Phone</td>
                <td>Update Status</td>
              </tr>
            </thead>
            <tbody className="table__tbody-primary">
              {loading ? (
                <tr>
                  <td colSpan="10">Loading...</td>
                </tr>
              ) : (
                filteredPromotes.map((promote, index) => (
                  <tr className="table__row-loading" key={promote._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(promote._id)}
                        onChange={() => handleSelectOrder(promote._id)}
                      />
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>
                      {promote.status}
                    </td>
                    <td style={{ color: '#333', fontWeight: 700, textAlign: 'left' }}>
                      {promote.orderItems.map((item, idx) => (
                        <div key={idx}>
                          <div><strong>Product Name:</strong> {item.productName}</div>
                          <div><strong>Product Price:</strong> ${item.productPrice}</div>
                        </div>
                      ))}
                    </td>
                    <td style={{ backgroundColor: '#e0f1d4' }}>
                      {promote.user ? promote.user.username || promote.user.name : 'No user data'}
                    </td>
                    <td style={{ backgroundColor: '#d5a2f7', fontWeight: 700 }}>
                      {promote.dateOrdered}
                    </td>
                    <td style={{ fontWeight: 700, textAlign: 'center', color: 'red' }}>
                      ${promote.totalPrice || 'None'}
                    </td>
                    <td style={{ backgroundColor: '#fff2c1' }}>
                      {promote.postalCode}
                    </td>
                    <td style={{ backgroundColor: '#fff2c1' }}>
                      {promote.shippingAddress1}
                    </td>
                    <td style={{ backgroundColor: '#fff2c1' }}>
                      {promote.phone}
                    </td>
                    <td>
                      <div className="table__edit-btn">
                        <EditButtonPromote promote={promote} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="promote__btn-container">
            <button onClick={downloadSelectedCSV} className="promote__btn-add">
              Export Selected Orders to CSV
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromotePage;
