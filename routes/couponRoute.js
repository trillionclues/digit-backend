const express = require('express')
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require('../controller/couponCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

// coupon controller
router.post('/', authMiddleware, isAdmin, createCoupon)
router.get('/', authMiddleware, isAdmin, getAllCoupons)

// dynamic routes should come after the specific ones
router.put('/:id', authMiddleware, isAdmin, updateCoupon)
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon)

module.exports = router