import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './category.css';
import AdminHeader from '../Common/AdminHeader';
import AdminSidebar, { handleLoadOptionSelected } from '../Common/AdminSidebar';
import { handleLoadingPage } from '../../Common';
import EditButtonCategory from '../../EditButton/EditButtonCategory';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));

  console.log('authAdmin.accessToken:::', authAdmin.accessToken)




    useEffect(() => {
      document.title = 'ShopTECH | Category';
      const fetchAPI = () => {
        fetch('http://localhost:3555/api/v1/categories', {
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
          setCategories(data);
          // setCountcategory(data.length);
          setLoading(false);
        })
        .catch((error) => {
          console.error('There was a problem with your fetch operation:', error);
        });
      };
      
      fetchAPI();
      handleLoadOptionSelected(3);
    }, []);

    console.log('categories:::', categories)





  const navigate = useNavigate();

  const handleClickBtnAdd = (e) => {
    handleLoadingPage(1);
    window.setTimeout(() => {
      navigate('/admin/category/add');
    }, 1000);
  };

  return (
    <>
      <AdminSidebar />
      <div id="admin-box">
        <AdminHeader />
        <div className="admin__title">
          <label className="admin__tilte-label">
            Have a nice day, admin!
          </label>
          <label className="admin__tilte-describe">
            category management page
          </label>
        </div>

        <div className="category__group">
          <div className="category__header">
            <label className="category__header-title">Category list</label>
          
          </div>

          <div className="category__list">
            {loading ? (
              <p>Đang kết nối đến server ... </p>
            ) : (
              categories.map((category, index) => (
                <div className="category__item" key={index}>
                  <label style={{ color: 'white' }} className="admin__item-id">
                    NO: 0{index + 1}
                  </label>
                  <div className="category__item-avatar">
                    <img
                      src={category.image}
                      className="category__item-img"
                    ></img>
                  </div>
                  <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <label
        style={{
          fontSize: '1.6rem',
          fontWeight: 'bold',
          lineHeight: '2.2rem',
          textAlign: 'left',
          width: '100%',
        }}
        className="admin__item-admin-name"
      >
        {category.name}
      </label>

      <EditButtonCategory category={category} />
    </div>

                  {/* <div className="admin__item-info">
                    <label className="admin__item-info-label">
                    category Type:
                    </label>
                    <p className="admin__item-info-content">{category['category'].name}</p>
                  </div>
                  <div className="admin__item-info">
                    <label className="admin__item-info-label">
                      Status:
                    </label>
                    <p className="admin__item-info-content">
                      {' '}
                      {category.countInStock > 0 ? `In stock || Quantity: ${category.countInStock}` : 'Out of stock'}
                    </p>
                  </div>
                  <div className="admin__item-info--last">
                    <div className="admin__item-info-price">
                      <p
                        style={{
                          fontSize: '1.6rem',
                          fontWeight: 'bold',
                          color: 'red',
                          textAlign: 'right',
                          width: '100%',
                        }}
                        className="admin__item-info-content"
                      >
                        {Number(category.price).toLocaleString() || 'Trống!'} VNĐ{' '}
                      </p>
                    </div> */}
                    <div className="admin__item-eidt">
                      <div
                        style={{
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          color: 'red',
                          textAlign: 'right',
                          width: '100%',
                        }}
                        className="admin__item-info-content"
                      >
                        {/* <EditButtonCategory category={category} /> */}
        
                      </div>
                    {/* </div> */}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="category__btn-container">
            <button className="category__btn-add" onClick={handleClickBtnAdd}>
            Add new category
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
