const asyncHandler = require("express-async-handler");
const {
  handleCreateProdCat,
  handleUpdateProdCat,
  handleGetProdCat,
  handleGetAllCategories,
  handleDeleteCat,
} = require("../Service/Product/prodCatService");

// create new category
const createProdCategory = asyncHandler(async (req, res) => {
  try {
    const body = req.body;
    const newCategory = await handleCreateProdCat.create(body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// update category
const updateProdCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProdCat = await handleUpdateProdCat(id, req.body);
    res.json(updatedProdCat);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single category
const getSingleProdCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const getCategory = await handleGetProdCat(id);
    res.json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const getCats = await handleGetAllCategories();
    res.json(getCats);
  } catch (error) {
    throw new Error(error);
  }
});
// delete category
const deleteProdCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCat = await handleDeleteCat(id);
    res.json({ deletedCat });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProdCategory,
  updateProdCategory,
  deleteProdCategory,
  getSingleProdCategory,
  getAllCategories,
};
