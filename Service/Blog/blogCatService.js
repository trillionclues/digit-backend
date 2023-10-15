const BlogCategory = require("../../models/blogCatModel");
const { validateMongoDBId } = require("../../utils/validateMongoId");

const createNewBlogCat = async (body) => {
  const newCategory = await BlogCategory.create(body);
  return newCategory;
};

const updateBlogCat = async (id, body) => {
  validateMongoDBId(id);
  const updateCat = await BlogCategory.findByIdAndUpdate(id, body, {
    new: true,
  });
  return updateCat;
};

const getBlogCat = async (id) => {
  validateMongoDBId(id);
  const getCategory = await BlogCategory.findById(id);
  return getCategory;
};

const getAllBlogCat = async () => {
  const getCats = await BlogCategory.find();
  return getCats;
};

const deleteBlogCat = async (id) => {
  validateMongoDBId(id);
  const deleteCat = await BlogCategory.findByIdAndDelete(id);
  return deleteCat;
};

module.exports = {
  createNewBlogCat,
  updateBlogCat,
  getBlogCat,
  getAllBlogCat,
  deleteBlogCat,
};
