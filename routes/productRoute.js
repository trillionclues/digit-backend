const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadProdImages,
  deleteProdImages,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");

// product controller
router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/", getAllProducts);
router.put("/rating", authMiddleware, rating);
router.put("/wishlist", authMiddleware, addToWishList);

// These specific routes should come before the dynamic ones else...otilorr
router.put(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadProdImages
);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.get("/:id", getSingleProduct);
router.delete(
  "/delete-image/:public_id",
  authMiddleware,
  isAdmin,
  deleteProdImages
);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
