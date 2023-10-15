const ProdCategory = require("../../models/prodCategoryModel");
const { validateMongoDBId } = require("../../utils/validateMongoId");

const handleCreateProdCat = async (body) => {
  const newCategory = await ProdCategory.create(body);
  return newCategory;
};

const handleUpdateProdCat = async (id, body) => {
  validateMongoDBId(id);
  const updatedProdCat = await ProdCategory.findByIdAndUpdate(id, body, {
    new: true,
  });
  return updatedProdCat;
};

const handleGetProdCat = async (id) => {
  validateMongoDBId(id);
  const getCategory = await ProdCategory.findById(id);
  return getCategory;
};

const handleGetAllCategories = async () => {
  const getAllCats = await ProdCategory.find();
  return getAllCats;
};

const handleDeleteCat = async (id) => {
  validateMongoDBId(id);
  const deleteCat = await ProdCategory.findByIdAndDelete(id);
  return deleteCat;
};

module.exports = {
  handleCreateProdCat,
  handleUpdateProdCat,
  handleGetProdCat,
  handleGetAllCategories,
  handleDeleteCat,
};
