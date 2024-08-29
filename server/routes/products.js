const express = require('express');
const productsController = require('../controllers/products');
const reviewsController = require('../controllers/reviews');

const router = express.Router();

router.get('/', productsController.getProducts);

router.get('/search', productsController.searchProducts);

// When /products/count is called without the /admin, it will redirect to this route and "count" will be used as id
router.get('/:id', productsController.getProductById);

router.post('/:id/reviews', reviewsController.leaveReview);

router.get('/:id/reviews', reviewsController.getProductReviews);

router.get('/reviews/abc', reviewsController.getAllReviews);

router.get('/reviews/category/:categoryName', reviewsController.getReviewsByCategoryName);

router.delete('/reviews/delete/:reviewId', reviewsController.deleteReviewById);


module.exports = router;
