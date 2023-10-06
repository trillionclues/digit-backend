const Coupon = require('../models/couponModel')
const asyncHandler = require('express-async-handler')
const {validateMongoDBId} = require('../utils/validateMongoId')

// create coupon
const createCoupon = asyncHandler(async(req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

// get all coupons
const getAllCoupons = asyncHandler(async(req, res) => {
    try {
        const getCoupon = await Coupon.find()
        res.json(getCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

// update coupon
const updateCoupon = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try {
        const updated = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updated)
    } catch (error) {
        throw new Error(error)
    }
})

// delete coupon
const deleteCoupon = asyncHandler(async(req, res) => {
    const {id} =  req.params
    validateMongoDBId(id)
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id)
        res.json({deletedCoupon})
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {createCoupon, deleteCoupon, getAllCoupons, updateCoupon}