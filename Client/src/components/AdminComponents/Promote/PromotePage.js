import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminHeader from '../Common/AdminHeader';
import AdminSidebar, { handleLoadOptionSelected } from '../Common/AdminSidebar';
import { handleLoadingPage } from '../../Common';
import EditButtonPromote from '../../EditButton/EditButtonPromote';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge } from 'react-bootstrap';
import './styles/promote-style.css';

const PromotePage = () => {
  const [promotes, setPromotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));
  useEffect(() => {
    const fetchAPI = () => {
      document.title = 'ShopTECH | Chương trình khuyến mãi';
      // fetch('https://server-shoptech.onrender.com/api/promotes')
      //   .then((res) => res.json())
      //   .then((data) => {
      //     setPromotes(data);
      //     setLoading(false);
      //   });


        fetch(`http://localhost:3555/api/v1/admin/orders`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authAdmin.accessToken}` , 
            'Content-Type': 'application/json'
          }
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('dataOrrder:: ', data)
            setPromotes(data);
            setLoading(false);
          });
    };
    fetchAPI();
    handleLoadOptionSelected(3);
  }, []);

  const handleAddPromote = (event) => {
    event.preventDefault();
    handleLoadingPage(1);
    window.setTimeout(() => {
      navigate('/admin/promote/add');
    }, 1000);
  };




  return (
    <>
      <AdminSidebar />
      <div id="admin-box">
        <AdminHeader />
        <div className="admin__title">
          <label className="admin__tilte-label">
          Good day, admin!
          </label>
          <label className="admin__tilte-describe">
          Order management page
          </label>
        </div>

        <div className="promote__group">
          <div className="promote__header">
            <label className="promote__header-title">
            List of orders
            </label>
          </div>

          {/* <div className="promote__btn-container">
            <button className="promote__btn-add" onClick={handleAddPromote}>
              Thêm chương trình khuyến mãi
            </button>
          </div> */}

          <table className="table">
            <thead>
              <tr className="table__thead-primary">
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
                  <td>Loading...</td>
                </tr>
              ) : (
                promotes.map((promote, index) => (
                  <tr className="table__row-loading" key={index}>
                    <td
                      style={{
                        textAlign: 'center',
                       // background: '#ffcdd2',
                        fontWeight: 700,
                      }}
                    >
                      {promote.status}
                    </td>
                    <td
                      style={{
                        color: '#333',
                        fontWeight: 700,
                        textAlign: 'left',
                      }}
                    >
                      {/* {promote['user'].name} */}

                      {promote.orderItems.map((item, index) => (
        <div key={index}>
         {/* // <hr /> */}
          <div><strong>Product Name:</strong> {item.productName}</div>
          <div><strong>Product Price:</strong> ${item.productPrice}</div>
        </div>
      ))}
                      
                    </td>
                    <td style={{ backgroundColor: '#e0f1d4' }}>
                    {promote.user ? `${promote.user.username || promote.user.name}` : 'No user data'}
                    </td>
                    <td style={{ backgroundColor: '#d5a2f7', fontWeight: 700 }}>
                      {promote.dateOrdered}
                    </td>
                    <td
                      style={{
                        fontWeight: 700,
                        textAlign: 'center',
                        //fontSize: '2.4rem',
                        color: 'red',
                      }}
                    >
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
                        {<EditButtonPromote promote={promote} />}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PromotePage;
