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
  const [categories, setCategories] = useState([]);
  const [genderAgeCategory, setGenderAgeCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [sizes, setSizes] = useState(['']);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));

  useEffect(() => {
    document.title = 'ShopTECH | Add Product';
    handleLoadOptionSelected(2);

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
        setCategories(data);
      } catch (error) {
        console.error('There was a problem fetching categories:', error);
      }
    };

    fetchCategories();
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

  const removeColourField = (index) => {
    const updatedColours = [...colours];
    updatedColours.splice(index, 1);
    setColours(updatedColours);
  };

  const removeSizeField = (index) => {
    const updatedSizes = [...sizes];
    updatedSizes.splice(index, 1);
    setSizes(updatedSizes);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!name.trim()) formErrors.name = 'Product name is required';
    if (!description.trim()) formErrors.description = 'Description is required';
    if (!price || price <= 0) formErrors.price = 'Price must be greater than zero';
    if (!category) formErrors.category = 'Please select a category';
    if (!genderAgeCategory) formErrors.genderAgeCategory = 'Please select a gender/age category';
    if (!countInStock || countInStock < 0) formErrors.countInStock = 'Stock quantity must be a positive number';
    if (!imagePrimary) formErrors.imagePrimary = 'Primary image is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
          <label className="admin__title-label">Have a nice day, admin!</label>
          <label className="admin__title-describe">Add new product page</label>
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
                  {errors.name && <p className="error">{errors.name}</p>}

                  <label className="add__label">Description</label>
                  <textarea
                    className="add__input"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  {errors.description && <p className="error">{errors.description}</p>}

                  <label className="add__label">Product Price</label>
                  <input
                    type="number"
                    className="add__input"
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  {errors.price && <p className="error">{errors.price}</p>}

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
                  {errors.category && <p className="error">{errors.category}</p>}

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
                  {errors.genderAgeCategory && <p className="error">{errors.genderAgeCategory}</p>}

                  <label className="add__label">Stock Quantity</label>
                  <input
                    type="number"
                    className="add__input"
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                  />
                  {errors.countInStock && <p className="error">{errors.countInStock}</p>}

                  <div className="add__field-group">
                    <label className="add__label">Colours</label>
                    {colours.map((colour, index) => (
                      <div key={index} className="input-group">
                        <input
                          type="text"
                          className="add__input"
                          value={colour}
                          onChange={(e) => handleColourChange(index, e.target.value)}
                        />
                        <button
                          type="button"
                          className="add__btn-add-small"
                          onClick={addColourField}
                        >
                          +
                        </button>
                        {colours.length > 1 && (
                          <button
                            type="button"
                            className="add__btn-remove-small"
                            onClick={() => removeColourField(index)}
                          >
                            -
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="add__field-group">
                    <label className="add__label">Sizes</label>
                    {sizes.map((size, index) => (
                      <div key={index} className="input-group">
                        <input
                          type="text"
                          className="add__input"
                          value={size}
                          onChange={(e) => handleSizeChange(index, e.target.value)}
                        />
                        <button
                          type="button"
                          className="add__btn-add-small"
                          onClick={addSizeField}
                        >
                          +
                        </button>
                        {sizes.length > 1 && (
                          <button
                            type="button"
                            className="add__btn-remove-small"
                            onClick={() => removeSizeField(index)}
                          >
                            -
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <label className="add__label">Primary Image</label>
                  <input
                    type="file"
                    className="add__input"
                    onChange={handleImagePrimaryChange}
                    accept="image/*"
                    required
                  />
                           {errors.imagePrimary && <p className="error">{errors.imagePrimary}</p>}

<label className="add__label">Gallery Images</label>
<input
  type="file"
  className="add__input"
  onChange={handleImageGalleryChange}
  accept="image/*"
  multiple
/>
</div>
</div>

<div className="button-container">
<button className="add__btn-confirm" onClick={handleAddProduct}>
Confirm
<i className="add__btn-icon fa fa-check"></i>
</button>

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
</div>
</>
);
};

export default AddProduct;
