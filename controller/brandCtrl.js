const asyncHandler = require("express-async-handler");
const {
  createNewBrand,
  handleUpdateBrand,
  getABrand,
  handleGetAllBrand,
  handleDeleteBrand,
} = require("../Service/Brand/brandService");

// create new brand
const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await createNewBrand(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// update brand
const updateBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBrand = await handleUpdateBrand(id, req.body);
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single brand
const getSingleBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const getBrand = await getABrand(id);
    res.json(getBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// get all brands
const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const getBrands = await handleGetAllBrand();
    res.json(getBrands);
  } catch (error) {
    throw new Error(error);
  }
});
// delete blog category
const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBrand = await handleDeleteBrand(id);
    res.json({ deletedBrand });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getSingleBrand,
  getAllBrand,
};
