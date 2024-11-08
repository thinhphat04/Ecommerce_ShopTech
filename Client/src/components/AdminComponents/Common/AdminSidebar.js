import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLoadingPage } from '../../Common';
import AuthAdminContext from '../../../context/AuthAdminContext';

const handleLoadOptionSelected = (index) => {
  const optionItems = document.querySelectorAll('.sidebar__component-item');
  const optionItemActive = document.querySelector(
    '.sidebar__component-item.sidebar__component-item--active',
  );
  optionItems.forEach((item, i) => {
    if (optionItemActive) {
      optionItemActive.classList.remove('sidebar__component-item--active');
    }
  });
  optionItems[index].classList.add('sidebar__component-item--active');
};

const AdminSidebar = () => {
  const [authAdmin, setAuthAdmin] = useContext(AuthAdminContext);
  const [admins, setAdmins] = useState([]);
  const [adminID, setAdminID] = useState('');

  useEffect(() => {
    const fetchAPIs = () => {
      fetch('https://server-shoptech.onrender.com/api/admins')
        .then((res) => res.json())
        .then((data) => {
          setAdmins(data);
        });
    };
    fetchAPIs();
  }, []);

  useEffect(() => {
    admins.map((admin) => {
      if (admin.adminName === window.localStorage.getItem('adminNameLogin')) {
        setAdminID(admin.adminID);
      }
    });
  }, [admins]);

  const navigate = useNavigate();

  const handleNavigate = (link) => {
    handleLoadingPage(1);
    window.setTimeout(() => {
      navigate(link);
    }, 1000);
  };

  const LogOut = (e) => {
    e.preventDefault();
    setAuthAdmin({ adminName: null, token: '' });
    window.localStorage.removeItem('authAdmin');
    window.alert('Đăng xuất tài khoản thành công');
    handleLoadingPage(1);
    window.setTimeout(() => {
      window.location.href = `/admin`;
    }, 1000);
  };

  return (
    <div id="sidebar">
      <div
        className="sidebar__logo"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/admin/dashboard';
        }}
      ></div>

      <div
        className="sidebar__component-item"
        onClick={() => {
          handleNavigate(`/admin/dashboard`);
        }}
      >
        <i
          className="sidebar__component-item-icon fa fa-home"
          aria-hidden="true"
        ></i>
        Dashboard
      </div>

      <div className="sidebar__component">
        <label className="sidebar__component-label">Data Management</label>
        <div
          className="sidebar__component-item"
          onClick={() => {
            handleNavigate(`/admin/customer`);
          }}
        >
          <i
            className="sidebar__component-item-icon fa fa-users"
            aria-hidden="true"
          ></i>
          Customers
        </div>
        <div
          className="sidebar__component-item"
          onClick={() => {
            handleNavigate(`/admin/product`);
          }}
        >
          <i
            className="sidebar__component-item-icon fa fa-table"
            aria-hidden="true"
          ></i>
          Products
        </div>
        <div
          className="sidebar__component-item"
          onClick={() => {
            handleNavigate(`/admin/category`);
          }}
        >
          <i
            className="sidebar__component-item-icon fa fa-folder"
            aria-hidden="true"
          ></i>
          Categories
        </div>
        <div
          className="sidebar__component-item"
          onClick={() => {
            handleNavigate(`/admin/promote`);
          }}
        >
          <i
            className="sidebar__component-item-icon fa fa-shopping-cart"
            aria-hidden="true"
          ></i>
          Orders
        </div>
        <div
          className="sidebar__component-item"
          onClick={() => {
            handleNavigate(`/admin/feedback`);
          }}
        >
          <i
            className="sidebar__component-item-icon fa fa-comments"
            aria-hidden="true"
          ></i>
          Feedback || Review
        </div>
        <div
          className="sidebar__component-item"
          onClick={() => {
            handleNavigate(`/admin/chat`);
          }}
        >
          <i
            className="sidebar__component-item-icon fa fa-comment"
            aria-hidden="true"
          ></i>
          Chat with Customer
        </div>

      </div>

      <div className="sidebar__component">
        <label className="sidebar__component-label">OPTION</label>
        <div
          className="sidebar__component-item"
          onClick={() => {
            handleNavigate(`/admin/info-admin/${adminID}`);
          }}
        >
          <i
            className="sidebar__component-item-icon fa fa-user"
            aria-hidden="true"
          ></i>
          Profile
        </div>
        <div className="sidebar__component-item" onClick={LogOut}>
          <i
            className="sidebar__component-item-icon fa fa-sign-out"
            aria-hidden="true"
          ></i>
          Logout
        </div>
      </div>
    </div>
  );
};

export { handleLoadOptionSelected };
export default AdminSidebar;
