import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './styles/promote-style.css';
import AdminHeader from '../Common/AdminHeader';
import AdminSidebar, { handleLoadOptionSelected } from '../Common/AdminSidebar';
import { changeFilename, handleLoadingPage } from '../../Common';
import axios from 'axios';

const InfoPromote = () => {
  const [promote, setPromote] = useState({});
  const { id } = useParams();
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState(promote.status); 
  const navigate = useNavigate();
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));
  useEffect(() => {
    document.title = 'ShopTECH | Thông tin khuyến mãi';
    const fetchAPI = () => {
      // fetch('http://localhost:3555/api/v1/admin/orders/' + id, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${authAdmin.accessToken}` , 
      //     'Content-Type': 'application/json'
      //   }
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     setPromote(data);
      //   });

        fetch('http://localhost:3555/api/v1/orders/' + id, {
         
          headers: {
            'Authorization': `Bearer ${authAdmin.accessToken}` , 
            'Content-Type': 'application/json'
          }
        }
      
      )
          .then((res) => res.json())
          .then((data) => {
            setPromote(data);
          });
    };

    fetchAPI();
    handleLoadOptionSelected(3);
  }, []);

  console.log('promotPayemnt:: ',promote )

  // const changeImage = () => {
  //   const preview = document.querySelector('.info-promote__avatar-img');
  //   const image = document.querySelector('#image-change').files[0];
  //   const reader = new FileReader();
  //   reader.addEventListener(
  //     'load',
  //     () => {
  //       preview.src = reader.result;
  //     },
  //     false,
  //   );

  //   if (image) {
  //     reader.readAsDataURL(image);
  //     setImageFile(image);
  //   }
  // };
  console.log('statusAA::', status)
  const handleConfirmChange = async (e) => {
    e.preventDefault();
    // const inputName = document.querySelector('.info-promote__input-name');
    // const inputElements = document.querySelectorAll('.info-promote__input');
    console.log('status::', status)
    if (
      window.confirm(
        'Do you want update status for this order?',
      ) == true
    ) {
      try {

          axios
            .put(`http://localhost:3555/api/v1/admin/orders/${id}`, {
              status:status
            },{
              headers: {
                'Authorization': `Bearer ${authAdmin.accessToken}`,
                'Content-Type': 'application/json',
              },
            })
            .then((res) => {
              console.log('resKHAI:: ', res)
              if (res && res.status == 200) {
                window.alert('Update Status Sucess!');
                handleLoadingPage(1);
                window.setTimeout(() => {
                  navigate(`/admin/promote`);
                }, 1000);
              } else {
                alert('Cập nhật thông tin thất bại');
              }
            });
        }
       catch (error) {
        alert(error);
      }
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (
      window.confirm(
        'Are you sure delete this order?',
      ) == true
    ) {
      try {
        const res = await axios.delete(
          `http://localhost:3555/api/v1/admin/orders/${id}`
          ,{
            headers: {
              'Authorization': `Bearer ${authAdmin.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('resDELETE:  ', res)
        if (res && res.status == 204) {
          window.alert('Delete Success!');
          handleLoadingPage(1);
          window.setTimeout(() => {
            window.location.href = '/admin/promote';
          }, 1000);
        } else {
          alert('Xóa thất bại');
        }
      } catch (error) {
        alert(error);
      }
    }
  };
  const statusOptions = {
    pending: ['processed', 'cancelled', 'expired'],
    processed: ['shipped', 'cancelled', 'on-hold'],
    shipped: ['out-for-delivery', 'cancelled', 'on-hold'],
    'out-for-delivery': ['delivered', 'cancelled'],
    'on-hold': ['cancelled', 'shipped', 'out-for-delivery'],
  };
  const options = statusOptions[promote.status] || [];

  return (
    <React.Fragment>
      <AdminSidebar />
      <div id="admin-box">
        <AdminHeader />
        {/* <div className="admin__title">
          <label className="admin__tilte-label">
            Have a nice day, admin!
          </label>
          <label className="admin__tilte-describe">
            Trang quản lý khách hàng
          </label>
        </div> */}
{/* info-admin-__group--custom */}
        <div className="info-page__group ">
          <div className="info-promote__header">
            Update status
          </div>

          <div className="info-promote__body">
            {/* <div className="add__avatar">
              {/* <img
                src={
                  promote.imageLink ||
                  `${process.env.REACT_APP_API}/public/img-product-empty.png`
                }
                className="info-promote__avatar-img"
              ></img> */}
              {/* <input
                type="file"
                id="image-change"
                //onChange={changeImage}
                hidden
              ></input>
              <label
                htmlFor="image-change"
                className="info-admin-product__image-btn"
              >
                Thay đổi hình ảnh khuyến mãi
              </label>
            </div> */} 

            <label
              style={{ textAlign: 'center', fontWeight: '1000' }}
              className="info-page__label"
            >
              {/* Tên chương trình khuyến mãi */}
            </label>
            <label
              style={{ textAlign: 'center', fontWeight: '1000' }}
              className="info-page__label"
            >
              {/* Tên chương trình khuyến mãi */}
            </label>
            {/* <input
              style={{ fontWeight: 'bold', color: 'green' }}
              className="info-promote__input-name"
              defaultValue={promote.name}
            /> */}

            <div className="info-promote__box-info">
              <div className="info-promote__col-1">
                <label className="info-promote__label">Payment Id</label>
                <input
                  //type="date"
                  className="info-promote__input"
                  defaultValue={promote.paymentId}
                />

                <label className="info-promote__label">Total Price</label>
                <input
                  //type="date"
                  className="info-promote__input"
                  defaultValue={promote.totalPrice}
                />
              </div>

              <div className="info-promote__col-2">
                <label
                  style={{ fontWeight: 'bold', color: 'red' }}
                  className="info-promote__label"
                >
                  Status now
                </label>
                <input
                  //type="number"
                  className="info-promote__input"
                  defaultValue={promote.status}
                />

                <label className="info-promote__label">
                  Status Update
                </label>
                <select className="info-promote__input"  value={status}
                   onChange={(e) => setStatus(e.target.value)} >
                  {options.map((option, index) => (
                  <option key={index} value={option}>
                   {option.charAt(0).toUpperCase() + option.slice(1)}
                 </option>
                ))}
                </select>
              </div>
            </div>
          </div>

          <div className="info-page__footer">
            <button
              className="info-page__btn"
              style={{ backgroundColor: 'red' }}
              onClick={handleDelete}
            >
              Delete Order<i className="ti-close"></i>
            </button>
            <button className="info-page__btn" onClick={handleConfirmChange}>
              Update Status<i className="ti-check"></i>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default InfoPromote;
