import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './category.css';
import AdminHeader from '../Common/AdminHeader';
import AdminSidebar from '../Common/AdminSidebar';
import { handleLoadingPage } from '../../Common';
import axios from 'axios';

const InfoCategory = () => {
  const [category, setCategory] = useState(null);
  const [imagePrimary, setImagePrimary] = useState(null);
  const handleImagePrimaryChange = (e) => {
    setImagePrimary(e.target.files[0]);
  }; 
  const colour = `#66CDAA`;
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));

  useEffect(() => {
    const fetchAPIs = async () => {
      document.title = 'ShopTECH | Thông tin sản phẩm';
      try {
        const res = await fetch('http://localhost:3555/api/v1/categories/' + id, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authAdmin.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log('dataCategoryID::', data);
        setCategory(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category:', error);
        setLoading(false);
      }
    };

    fetchAPIs();
  }, [id, authAdmin.accessToken]);

  const handleConfirmChangeInfo = async (e) => {
    e.preventDefault();
  
    const inputElements = document.querySelectorAll('.info-admin-product__input');
    const name = inputElements[0].value;
  
    if (window.confirm('Do you want to update?') === true) {
      try {
        const formData = new FormData();
        formData.append('name', name);
        if (imagePrimary) {
          formData.append('image', imagePrimary);
        }
  
        const res = await axios.put(
          `http://localhost:3555/api/v1/admin/categories/${id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${authAdmin.accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        if (res && res.data) {
          window.alert('Update Success!');
          handleLoadingPage(1);
          window.setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          alert('Update failed!');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred! Please try again later.');
      }
    }
  };
  

  

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    
    if (window.confirm('Are you sure to delete this category?') === true) {
      try {
        const res = await axios.delete(`http://localhost:3555/api/v1/admin/categories/${id}`, {
          headers: {
            'Authorization': `Bearer ${authAdmin.accessToken}`,
          },
        });
  
        if (res.status === 204) {
          window.alert('Delete successful!');
          handleLoadingPage(1);
          window.setTimeout(() => {
            window.location.href = '/admin/category';
          }, 1000);
        } else {
          console.log(res);
          alert('Delete failed');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Unauthorized: Please log in again.');
          // Optionally, redirect to login or refresh token
        } else {
          alert('An error occurred: ' + error.message);
        }
      }
    }
  };
  

  return (
    <div className="customer__container">
      <AdminSidebar />
      <div id="admin-box">
        <AdminHeader />

        <div className="info-admin-product__group info-admin-product__group--custom">
          <div className="info-admin-product__header">
            Category Information
          </div>

          <div className="info-admin-product__body">
            <div className="info-admin-product__col-1">
              <div className="info-admin-product__image-primary">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <img
                    className="info-admin-product__image-primary-img"
                    src={
                      category?.image ||
                      'https://server-shoptech.onrender.com/public/img-product-empty.png'
                    }
                    alt={category?.name || 'Category Image'}
                  />
                )}
              </div>
              <input
                    type="file"
                    className="add__input"
                    onChange={handleImagePrimaryChange}
                    accept="image/*"
                    required
                  />
            </div>

            <div className="info-admin-product__col-2">
              <div className="info-admin-product__box-info">
                <label className="info-admin-product__label">
                  Name of Category
                </label>
                <input
                  style={{ fontWeight: 'bold' }}
                  className="info-admin-product__input"
                  defaultValue={category?.name || ''}
                />
              </div>
            </div>
          </div>

          <div className="info-admin-product__footer">
            <button
              className="info-admin-product__btn"
              style={{ backgroundColor: 'red' }}
              onClick={handleDeleteCategory}
            >
              Xóa sản phẩm<i className="ti-check"></i>
            </button>
            <button
              className="info-admin-product__btn"
              onClick={handleConfirmChangeInfo}
            >
              Xác nhận<i className="ti-check"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCategory;
