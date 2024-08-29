import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './product.css';
import AdminHeader from '../Common/AdminHeader';
import AdminSidebar, { handleLoadOptionSelected } from '../Common/AdminSidebar';
import { handleLoadingPage } from '../../Common';
import EditButtonProduct from '../../EditButton/EditButtonProduct';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [countProduct, setCountProduct] = useState(0);

  const [loading, setLoading] = useState(true);
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));

  console.log('authAdmin.accessToken:::', authAdmin.accessToken)




    useEffect(() => {
      document.title = 'ShopTECH | Dữ liệu sản phẩm';
      const fetchAPI = () => {
        fetch('http://localhost:3555/api/v1/products', {
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
          setProducts(data);
          setCountProduct(data.length);
          setLoading(false);
        })
        .catch((error) => {
          console.error('There was a problem with your fetch operation:', error);
        });
      };
      
      fetchAPI();
      handleLoadOptionSelected(2);
    }, []);

    console.log('products:::', products)





  const navigate = useNavigate();

  const handleClickBtnAdd = (e) => {
    handleLoadingPage(1);
    window.setTimeout(() => {
      navigate('/admin/product/add');
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
            Product management page
          </label>
        </div>

        <div className="product__group">
          <div className="product__header">
            <label className="product__header-title">Product list</label>
            <div className="product__header-counting">
              {' '}
             Product number:
              <span className="customer__header-counting-number">
                {countProduct}
              </span>
            </div>
          </div>

          <div className="product__list">
            {loading ? (
              <p>Đang kết nối đến server ... </p>
            ) : (
              products.map((product, index) => (
                <div className="product__item" key={index}>
                  <label style={{ color: 'white' }} className="admin__item-id">
                    NO: 0{index + 1}
                  </label>
                  <div className="product__item-avatar">
                    <img
                      src={product.image}
                      className="product__item-img"
                    ></img>
                  </div>
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
                    {product.name}
                  </label>

                  <div className="admin__item-info">
                    <label className="admin__item-info-label">
                    Product Type:
                    </label>
                    <p className="admin__item-info-content">{product['category'].name}</p>
                  </div>
                  <div className="admin__item-info">
                    <label className="admin__item-info-label">
                      Status:
                    </label>
                    <p className="admin__item-info-content">
                      {' '}
                      {product.countInStock > 0 ? `In stock || Quantity: ${product.countInStock}` : 'Out of stock'}
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
                        {Number(product.price).toLocaleString() || 'Trống!'} ${' '}
                      </p>
                    </div>
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
                        <EditButtonProduct product={product} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="product__btn-container">
            <button className="product__btn-add" onClick={handleClickBtnAdd}>
            Add new products
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
