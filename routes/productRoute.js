const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require('../controller/productCtrl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

// product controller
router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/', getAllProducts);

// These specific routes should come before the dynamic ones else...otilorr
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.get('/:id', getSingleProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;
