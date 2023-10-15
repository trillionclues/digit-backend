const BlogCategory = require("../models/blogCatModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDBId } = require("../utils/validateMongoId");
const {
  createNewBlogCat,
  updateBlogCat,
  getBlogCat,
  getAllBlogCat,
  deleteBlogCat,
} = require("../Service/Blog/blogCatService");

// create new blog category
const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await createNewBlogCat(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// update blog category
const updateBlogCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBlogCat = await updateBlogCat(id, req.body);
    res.json(updatedBlogCat);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single blog category
const getSingleBlogCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const getCategory = await getBlogCat(id);
    res.json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// get all blog categories
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const getCats = await getAllBlogCat();
    res.json(getCats);
  } catch (error) {
    throw new Error(error);
  }
});
// delete blog category
const deleteBlogCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCat = await deleteBlogCat(id);
    res.json({ deletedCat });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getSingleBlogCategory,
  getAllCategories,
};
