import React, { useState, useEffect } from 'react';
import './styles/info-style.css';
import AdminHeader from '../Common/AdminHeader';
import AdminSidebar, { handleLoadOptionSelected } from '../Common/AdminSidebar';
import axios from 'axios';
import { changeFilename, handleLoadingPage } from '../../Common';

const InfoAdmin = () => {
  const [admin, setAdmin] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));

  useEffect(() => {
    document.title = 'ShopTECH | Quản trị viên';
     const fetchAPI = () => {
       fetch(
         `http://localhost:3555/api/v1/users/${
           JSON.parse(window.localStorage.getItem('authAdmin'))._id
         }`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authAdmin.accessToken}` , 
            'Content-Type': 'application/json'
          }
        }
       )
         .then((res) => res.json())
         .then((data) => {
          setAdmin(data);
       });
    };
   fetchAPI();
    handleLoadOptionSelected(7);
  }, []);

  const changeImageAdmin = () => {
    const preview = document.querySelector('.info-page__avatar-img');
    const imageAdmin = document.querySelector('#avatar-change-input').files[0];

    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        preview.src = reader.result;
      },
      false,
    );

    if (imageAdmin) {
      reader.readAsDataURL(imageAdmin);
      setImageFile(imageAdmin);
    }
  };

  const handleConfirmChange = async (e) => {
    e.preventDefault();
    const inputElements = document.querySelectorAll('.info-page__input');
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append(
          'avatar-admin',
          imageFile,
          changeFilename(imageFile.name, admin._id),
        );
        axios
          .post(
            'https://server-shoptech.onrender.com/api/admins/upload-image',
            formData,
          )
          .then((response) => {
            axios
              .put(
                `${process.env.REACT_APP_API}/api/admins/update-info/${
                  JSON.parse(window.localStorage.getItem('authAdmin')).admin._id
                } `,
                {
                  avatarUrl: response.data.path,
                  fullname: inputElements[1].value,
                  email: inputElements[2].value,
                  phone: inputElements[3].value,
                  address: inputElements[4].value,
                },
              )
              .then((res) => {
                if (res && res.data.success) {
                  alert('Cập nhật thông tin thành công!');
                  handleLoadingPage(1);
                  window.location.reload();
                } else {
                  alert('Cập nhật thông tin thất bại');
                }
              });
          })
          .catch((error) => {
            alert('Lỗi khi upload ảnh: ' + error);
            console.log(error);
          });
      } else {
        axios
          .put(
            `${process.env.REACT_APP_API}/api/admins/update-info/${
              JSON.parse(window.localStorage.getItem('authAdmin')).admin._id
            } `,
            {
              avatarUrl: admin.avatarUrl,
              fullname: inputElements[1].value,
              email: inputElements[2].value,
              phone: inputElements[3].value,
              address: inputElements[4].value,
            },
          )
          .then((res) => {
            if (res && res.data.success) {
              alert('Cập nhật thông tin thành công!');
              handleLoadingPage(1);
              window.location.reload();
            } else {
              alert('Cập nhật thông tin thất bại');
            }
          });
      }
    } catch (error) {
      alert(error);
    }
  };
  console.log('admin:::', admin)

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
          Admin information page
          </label>
        </div>

        <div className="info-page__group">
          <div className="info-page__header">
            ADMIN INFORMATION
          </div>

          <div className="info-page__body">
            <div className="info-page__col-1">
              {/* <div className="info-page__avatar">
                +
                <img
                  className="info-page__avatar-img"
                  src={admin.avatarUrl}
                ></img>
              </div> */}
              {/* <input
                type="file"
                name="avatar-admin"
                className="info-page__avatar-input"
                id="avatar-change-input"
                onChange={(e) => {
                  changeImageAdmin();
                }}
                hidden
              ></input> */}
              {/* <label
                className="info-page__avatar-btn"
                htmlFor="avatar-change-input"
              >
                Thay đổi Avatar
              </label>
              <label className="info-page__user-id">{admin.adminName}</label> */}
            </div>

            <div className="info-page__col-2">
              <label className="info-page__title">ADMIN INFORMATION</label>

              <div className="info-page__box-info">
                <label className="info-page__label">Admin ID</label>
                <input
                  style={{ fontWeight: 'bold' }}
                  readOnly
                  className="info-page__input info-page__input--readonly"
                  value={String(admin._id).toUpperCase()}
                />

                <label className="info-page__label">Username</label>
                <input
                  className="info-page__input"
                  defaultValue={admin.name}
                />

                <label className="info-page__label">Email</label>
                <input
                  className="info-page__input"
                  defaultValue={admin.email}
                />

                <label className="info-page__label">Phone</label>
                <input
                  className="info-page__input"
                  minLength="10"
                  maxLength="10"
                  defaultValue={admin.phone}
                />

                {/* <label className="info-page__label">Địa chỉ</label>
                <input
                  className="info-page__input"
                  defaultValue={admin.address}
                /> */}
              </div>
            </div>
          </div>

          {/* <div className="info-page__footer">
            <button className="info-page__btn" onClick={handleConfirmChange}>
              Xác nhận<i className="ti-check"></i>
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default InfoAdmin;
