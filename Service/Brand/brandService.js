const Brand = require("../../models/brandModel");
const { validateMongoDBId } = require("../../utils/validateMongoId");

const createNewBrand = async (body) => {
  const newBrand = await Brand.create(body);
  return newBrand;
};

const handleUpdateBrand = async (id, body) => {
  validateMongoDBId(id);
  const updateBrand = await Brand.findByIdAndUpdate(id, body, { new: true });
  return updateBrand;
};

const getABrand = async (id) => {
  validateMongoDBId(id);
  const getBrand = await Brand.findById(id);
  return getBrand;
};

const handleGetAllBrand = async () => {
  const getBrand = await Brand.find();
  return getBrand;
};

const handleDeleteBrand = async (id) => {
  validateMongoDBId(id);
  const deletebrand = await Brand.findByIdAndDelete(id);
  return deletebrand;
};

module.exports = {
  createNewBrand,
  handleUpdateBrand,
  getABrand,
  handleGetAllBrand,
  handleDeleteBrand,
};
