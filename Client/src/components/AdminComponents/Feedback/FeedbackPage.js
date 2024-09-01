import React, { useState, useEffect } from 'react';
import AdminHeader from '../Common/AdminHeader';
import AdminSidebar, { handleLoadOptionSelected } from '../Common/AdminSidebar';
import { handleLoadingPage } from '../../Common';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const authAdmin = JSON.parse(localStorage.getItem('authAdmin'));
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All'); 
  const fetchAPIs = () => {
    document.title = 'ShopTECH | Review';
    fetch(`http://localhost:3555/api/v1/categories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authAdmin.accessToken}` , 
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('dataCateGORY:::', data)
      //setCountProduct(data.length);
      setCategories(data);
       });  
    fetch(`http://localhost:3555/api/v1/products/reviews/abc`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authAdmin.accessToken}` , 
          'Content-Type': 'application/json'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        //console.log('dataREVIEW:::', data)
        //setCountProduct(data.length);
        setReviews(data);
         });     
       
  };

  useEffect(() => {
    fetchAPIs();
    handleLoadOptionSelected(5);
  }, []);

  const handleFillterByType = (type) => {
    var feedbackByType = [];
    fetch('https://server-shoptech.onrender.com/api/feedbacks')
      .then((res) => res.json())
      .then((data) => {
        data.map((feedback) => {
          if (feedback.type === type) {
            feedbackByType.push(feedback);
          }
        });
        setFeedbacks(feedbackByType);
      });

    const fillterList = document.querySelectorAll('.search-control__btn');
    fillterList.forEach((item) => {
      item.onclick = () => {
        fillterList.forEach((btn) =>
          btn.classList.remove('search-control__btn--active'),
        );
        item.classList.add('search-control__btn--active');
      };
    });
  };
  const renderStars = (rating) => {
    const fullStar = '★'; // Ký tự ngôi sao đầy
    const emptyStar = '☆'; // Ký tự ngôi sao rỗng
  
    // Tạo các span chứa ngôi sao với màu vàng cho ngôi sao đầy và màu xám cho ngôi sao rỗng
    const stars = fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
  
    return (
      <span style={{ color: '#ffc107', fontSize: '20px' }}>
        {stars}
      </span>
    );
  };
  const handleButtonClick = (categoryName) => {
    setActiveCategory(categoryName);
    handleLoadingPage(1);
    console.log('categoryName:: ', categoryName)
    setTimeout(() => {
      const url =
        categoryName === 'All'
          ? `http://localhost:3555/api/v1/products/reviews/abc`
          : `http://localhost:3555/api/v1/products/reviews/category/${categoryName}`;
  
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authAdmin.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          //console.log('dataREVIEW:::', data);
          setReviews(data);
        })
        .catch((error) => {
          console.error('Error fetching reviews:', error);
        });
    }, 1000);
  };

// Danh sách các từ ngữ tiêu cực hoặc tục tĩu
const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'stupid', 'ugly', 'idiot', 'crap', 'shit'];

const isNegativeComment = (comment) => {
  // Kiểm tra xem comment có chứa từ tiêu cực không
  const lowercasedComment = comment.toLowerCase(); // Chuyển comment về chữ thường để dễ so sánh
  return negativeWords.some((word) => lowercasedComment.includes(word));
};
const handleClick = (reviewId) => {
  if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
    // Gọi API để xóa review
    fetch(`http://localhost:3555/api/v1/products/reviews/delete/${reviewId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authAdmin.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('resssDELTETe:: ', res)
        if (res.ok) {
          // Xử lý khi xóa thành công, có thể cần cập nhật lại danh sách review
          alert('Xóa thành công!');
          ///handleLoadingPage(1);
          fetchAPIs();
          // Code để cập nhật lại danh sách hoặc giao diện sau khi xóa
        } else {
          alert('Xóa thất bại!');
        }
      })
      .catch((error) => {
        console.error('Error deleting review:', error);
      });
  }
};

  return (
    <React.Fragment>
      <AdminSidebar />
      <div id="admin-box">
        <AdminHeader />
        <div className="admin__title">
          <label className="admin__tilte-label">
            Have a nice day, admin!
          </label>
          {/* <label className="admin__tilte-describe">
            Trang quản lý ý kiến khách hàng
          </label> */}
        </div>

        <div className="promote__group">
          <label className="dash__group-title">
            List of Review
          </label>

          <div className="admin__list" style={{ maxHeight: 'none' }}>
            <div
              style={{ marginLeft: '0', marginBottom: '20px' }}
              className="search-control"
            >
               <button
        className={`search-control__btn ${
          activeCategory === 'All' ? 'search-control__btn--active' : ''
        }`}
        onClick={() => handleButtonClick('All')}
      >
        All
      </button>

      {categories.map((category, index) => (
        <button
          key={index}
          className={`search-control__btn ${
            activeCategory === category.name ? 'search-control__btn--active' : ''
          }`}
          onClick={() => handleButtonClick(category.name)}
        >
          {category.name}
        </button>
      ))}
            </div>

            <table className="table">
              <thead>
                <tr className="table__thead-primary">
                  <td>Product Name</td>
                  <td>Comment</td>
                  <td>Rating</td>
                  <td>User Comment</td>
                  <td>Time comment</td>
                  <td>Delete?</td>
                </tr>
              </thead>
              <tbody className="table__tbody-primary">
                {reviews.map((review, index) => (
                  //const isNegative = isNegativeComment(review.comment);
                  <tr className="table__row-loading" key={index}>
                    <td
                      style={{
                        textAlign: 'center',
                        background: '#ffcdd2',
                        fontWeight: 700,
                      }}
                    >
                      {review.productName}
                    </td>
                    <td
                      style={{
                        color: isNegativeComment(review.comment) ? 'red' : '#333', // Nếu là comment tiêu cực thì in đỏ
                        fontWeight: 700,
                        textAlign: 'left',
                      }}
                    >
                      {review.comment}
                    </td>
                    <td>{renderStars(review.rating)}</td>
                    <td style={{ fontWeight: 700, color: 'red' }}>
                      {review.userName}
                    </td>
                    <td
                      style={{
                        fontWeight: 400,
                        textAlign: 'justify',
                        fontSize: '1.4rem',
                        fontStyle: 'italic',
                      }}
                    >
                    {review.date || 'None'}
                    </td>
                    <td
                      style={{
                        fontWeight: 400,
                        textAlign: 'justify',
                        fontSize: '1.4rem',
                        fontStyle: 'italic',
                      }}
                    >
                      {isNegativeComment(review.comment) && (
                    <button
                      style={{
                        backgroundColor: '#ff4d4d',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = '#e60000')}
                      onMouseOut={(e) => (e.target.style.backgroundColor = '#ff4d4d')}
                      onMouseDown={(e) => (e.target.style.backgroundColor = '#cc0000')}
                      onMouseUp={(e) => (e.target.style.backgroundColor = '#e60000')}
                      onClick={() => handleClick(review._id)}
                    >
                      Xóa
                    </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FeedbackPage;
