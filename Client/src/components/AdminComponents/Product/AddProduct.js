import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './product.css';
import AdminHeader from '../Common/AdminHeader';
import AdminSidebar, { handleLoadOptionSelected } from '../Common/AdminSidebar';
import { handleLoadingPage } from '../../Common';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [colours, setColours] = useState(['']);
  const [imagePrimary, setImagePrimary] = useState(null);
  const [imageGallery, setImageGallery] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]); // Add a state for categories
  const [genderAgeCategory, setGenderAgeCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [sizes, setSizes] = useState(['']);
  const navigate = useNavigate();
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));

  useEffect(() => {
    document.title = 'ShopTECH | Add Product';
    handleLoadOptionSelected(2);

    // Fetch categories from the server
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3555/api/v1/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authAdmin.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await res.json();
        setCategories(data); // Set the fetched categories to the state
      } catch (error) {
        console.error('There was a problem fetching categories:', error);
      }
    };

    fetchCategories(); // Fetch categories when the component mounts
  }, []);

  const handleImagePrimaryChange = (e) => {
    setImagePrimary(e.target.files[0]);
  };

  const handleImageGalleryChange = (e) => {
    setImageGallery([...e.target.files]);
  };

  const handleColourChange = (index, value) => {
    const updatedColours = [...colours];
    updatedColours[index] = value;
    setColours(updatedColours);
  };

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = value;
    setSizes(updatedSizes);
  };

  const addColourField = () => {
    setColours([...colours, '']);
  };

  const addSizeField = () => {
    setSizes([...sizes, '']);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('genderAgeCategory', genderAgeCategory);
    formData.append('countInStock', countInStock);
 
    formData.append('image', imagePrimary);
    colours.forEach((colour, index) => {
formData.append(`colours[${index}]`, colour);
    });
    sizes.forEach((size, index) => {
      formData.append(`sizes[${index}]`, size);
    });
    imageGallery.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const res = await fetch('http://localhost:3555/api/v1/admin/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authAdmin.accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();

      if (data.success) {
        alert('Product added successfully');
        handleLoadingPage(1);
        window.setTimeout(() => {
          navigate('/admin/product');
        }, 1000);
      } else {
        window.alert('An error occurred while creating! Please try again');
      }
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
      window.alert('An error occurred while creating! Please try again');
    }
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
            Add new product page
          </label>
        </div>

        <div className="add-product__container">
          <div className="add__cover">
            <div className="add">
              <div className="add__header">ADD NEW PRODUCT</div>
              <div className="add__body">
                <div className="add__col-right">
                  <label className="add__title">Product Information</label>

                  <label className="add__label">Product Name</label>
                  <input
                    className="add__input"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <label className="add__label">Description</label>
                  <textarea
                    className="add__input"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />

                  <label className="add__label">Product Price</label>
                  <input
                    type="number"
                    className="add__input"
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />

                  <label className="add__label">Product Category</label>
                  <select
                    className="add__input"
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    value={category}
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
<option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <label className="add__label">Gender/Age Category</label>
                  <select
                    className="add__input"
                    onChange={(e) => setGenderAgeCategory(e.target.value)}
                    required
                    value={genderAgeCategory}
                  >
                    <option value="">Select value...</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                    <option value="kids">Kids</option>
                  </select>

                  <label className="add__label">Stock Quantity</label>
                  <input
                    type="number"
                    className="add__input"
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                  />

                  <label className="add__label">Colours</label>
                  {colours.map((colour, index) => (
                    <input
                      key={index}
                      type="text"
                      className="add__input"
                      value={colour}
                      onChange={(e) => handleColourChange(index, e.target.value)}
                    />
                  ))}
                  <button onClick={addColourField}>Add Colour</button>

                  <label className="add__label">Sizes</label>
                  {sizes.map((size, index) => (
                    <input
                      key={index}
                      type="text"
                      className="add__input"
                      value={size}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                    />
                  ))}
                  <button onClick={addSizeField}>Add Size</button>

                  <label className="add__label">Primary Image</label>
                  <input
                    type="file"
                    className="add__input"
                    onChange={handleImagePrimaryChange}
                    accept="image/*"
                    required
                  />

                  <label className="add__label">Gallery Images</label>
                  <input
                    type="file"
                    className="add__input"
                    onChange={handleImageGalleryChange}
                    accept="image/*"
                    multiple
                  />

                  {/* <label className="add__label">Product Status</label>
                  <select
                    className="add__input"
                    onChange={(e) => setStatus(e.target.value)}
                    value={status}
                  >
<option value="">Select value...</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select> */}

                  <button className="add__btn-confirm" onClick={handleAddProduct}>
                    Confirm
                    <i className="add__btn-icon fa fa-check"></i>
                  </button>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/product');
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
    </>
  );
};

export default AddProduct;