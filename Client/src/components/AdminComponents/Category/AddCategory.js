import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './category.css';
import { handleLoadingPage } from '../../Common';
import axios from 'axios';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [imagePrimary, setImagePrimary] = useState(null);
  const [nameError, setNameError] = useState('');
  const [imageError, setImageError] = useState('');
  const colour = `#66CDAA`;
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ShopTECH | Add Category';
  }, []);

  const handleImagePrimaryChange = (e) => {
    setImagePrimary(e.target.files[0]);
  };

  const validateFields = () => {
    let isValid = true;
    if (!name) {
      setNameError('Name is required.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!imagePrimary) {
      setImageError('Image is required.');
      isValid = false;
    } else {
      setImageError('');
    }

    return isValid;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return; // Stop if validation fails
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("colour", colour);
    formData.append('image', imagePrimary);

    try {
      const res = await fetch("http://localhost:3555/api/v1/admin/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authAdmin.accessToken}`,
        },
        body: formData,
      });

      // Parse the response as JSON
      const data = await res.json();

      if (res.ok) {
        alert("Category added successfully");
        handleLoadingPage(1);
        window.setTimeout(() => {
          navigate("/admin/category");
        }, 1000);
      } else {
        window.alert("An error occurred while creating! Please try again");
      }
    } catch (error) {
      console.log("Error:", error);
      window.alert("An error occurred! Please try again later.");
    }
  };

  return (
    <div className="add-product__container">
      <div className="add__cover">
        <div className="add">
          <div className="add__header">ADD NEW CATEGORY</div>
          <div className="add__body">
            <div className="add__col-right">
              <label className="add__title">CATEGORY INFORMATION</label>

              <label className="add__label">Name</label>
              <input
                className="add__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {nameError && <p className="add__error-message">{nameError}</p>}

              <label className="add__label">Image</label>
              <input
                type="file"
                className="add__input"
                onChange={handleImagePrimaryChange}
                accept="image/*"
                required
              />
              {imageError && <p className="add__error-message">{imageError}</p>}
            </div>
          </div>

          <div className="add__footer">
            <button className="add__btn-confirm" onClick={handleAddCategory}>
              Add
              <i className="add__btn-icon fa fa-check"></i>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/category");
              }}
              className="add__btn-close"
            >
              Close
              <i className="add__btn-icon fa fa-sign-out"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
