const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages
} = require('../controller/productCtrl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');

// product controller
router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/', getAllProducts);
router.put('/rating', authMiddleware, rating)
router.put('/wishlist', authMiddleware, addToWishList)

// These specific routes should come before the dynamic ones else...otilorr
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.get('/:id', getSingleProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;
