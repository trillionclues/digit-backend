const Coupon = require("../../models/couponModel");
const { validateMongoDBId } = require("../../utils/validateMongoId");

const handleCreateCoupon = async (body) => {
  const newCoupon = await Coupon.create(body);
  return newCoupon;
};

const handleGetAllCoupon = async () => {
  const getCoupon = await Coupon.find();
  return getCoupon;
};

const handleUpdateCoupon = async (id, body) => {
  validateMongoDBId(id);
  const update = await Coupon.findByIdAndUpdate(id, body, { new: true });
  return update;
};

const handleDeleteCoupon = async (id) => {
  validateMongoDBId(id);
  const deleteCoupon = await Coupon.findByIdAndDelete(id);
  return deleteCoupon;
};

module.exports = {
  handleCreateCoupon,
  handleGetAllCoupon,
  handleUpdateCoupon,
  handleDeleteCoupon,
};
