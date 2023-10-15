const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDBId } = require("../utils/validateMongoId");
const {
  handleCreateCoupon,
  handleGetAllCoupon,
  handleUpdateCoupon,
  handleDeleteCoupon,
} = require("../Service/Coupon/couponService");

// create coupon
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await handleCreateCoupon(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

// get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const getCoupon = await handleGetAllCoupon();
    res.json(getCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

// update coupon
const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await handleUpdateCoupon(id, req.body);
    res.json(updated);
  } catch (error) {
    throw new Error(error);
  }
});

// delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await handleDeleteCoupon(id);
    res.json({ deletedCoupon });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCoupon, deleteCoupon, getAllCoupons, updateCoupon };
