const express = require('express');
const router = express.Router();
const { createProduct } = require('../controller/productCtrl');

// product controller
router.post('/', createProduct);

module.exports = router;
