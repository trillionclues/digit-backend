const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const {
  createNewProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleGetProduct,
  handleGetAllProducts,
  handleAddWishlist,
  handleRating,
  handleUploadProdImages,
  handleProdImagesDelete,
} = require("../Service/Product/productService");

// create new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    // slugify title
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    // create new product
    const newProduct = await createNewProduct(req.body);
    res.json(newProduct);
  } catch (err) {
    throw new Error(err);
  }
});

// update a product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Use the filter object to update the product
    const updatedProduct = await handleUpdateProduct(id, body);

    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await handleDeleteProduct(id);
    res.json({ deletedProduct });
  } catch (err) {
    throw new Error(err);
  }
});

// get single product from params
const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const getProduct = await handleGetProduct(id);
    res.json({ getProduct });
  } catch (err) {
    throw new Error(err);
  }
});

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
  // await Product.find({ brand: req.query.brand;
  // await Product.where('category').equals(req.query.category)

  try {
    const queryObj = { ...req.query };
    const sortQuery = req.query.sort;
    const fieldsQuery = req.query.fields;
    const pageQuery = req.query.page;
    const limitQuery = req.query.limit;
    const product = await handleGetAllProducts(
      queryObj,
      sortQuery,
      fieldsQuery,
      pageQuery,
      limitQuery
    );
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// add to wishlist
const addToWishList = asyncHandler(async (req, res) => {
  try {
    const { prodId } = req.body;
    const { _id } = req.user;

    const updatedUser = await handleAddWishlist(prodId, _id);
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// add rating
const rating = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { star, comment, prodId } = req.body;
    const finalProductRating = await handleRating(_id, star, comment, prodId);
    res.json(finalProductRating);
  } catch (error) {
    throw new Error(error);
  }
});

// upload product images
const uploadProdImages = asyncHandler(async (req, res) => {
  try {
    const filesQuery = req.files;
    const images = await handleUploadProdImages(filesQuery);
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

// delete product images from cloudinary
const deleteProdImages = asyncHandler(async (req, res) => {
  try {
    // get the pubic_id from params using JS object keys
    const public_id = req.params.public_id;
    const deleted = await handleProdImagesDelete(public_id);
    if (deleted.result === "ok") {
      res.json({ message: "Image successfully deleted!" });
    } else {
      res.status(500).json({ message: "Failed to delete the image" });
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the image" });
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  addToWishList,
  deleteProduct,
  rating,
  uploadProdImages,
  deleteProdImages,
};
