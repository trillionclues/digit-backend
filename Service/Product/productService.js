const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const {
  cloudinaryImageUpload,
  cloudinaryDeleteUpload,
} = require("../../utils/cloudinary");
const { validateMongoDBId } = require("../../utils/validateMongoId");
const fs = require("fs");

const createNewProduct = async (body) => {
  // create new product
  const newProduct = await Product.create(body);
  return newProduct;
};

const handleUpdateProduct = async (id, body) => {
  validateMongoDBId(id);
  const updateProduct = await Product.findOneAndUpdate({ _id: id }, body, {
    new: true,
  });

  if (!updateProduct) {
    return res.status(404).json({ message: "Product not found!" });
  }
  return updateProduct;
};

const handleDeleteProduct = async (id) => {
  validateMongoDBId(id);
  const deleteSingleProduct = await Product.findByIdAndDelete(id);
  return deleteSingleProduct;
};

const handleGetProduct = async (id) => {
  validateMongoDBId(id);
  const getProduct = await Product.findById(id);

  if (!getProduct) throw new Error("Product does not exist!");
  return getProduct;
};

const handleGetAllProducts = async (
  queryObj,
  sortQuery,
  fieldsQuery,
  pageQuery,
  limitQuery
) => {
  // handle queryStrings for FILTERING...
  // eg localhost:5000/api/product/?brand=Apple&price[gte]=9000&price[lte]=20000
  const excludeFields = ["page", "sort", "limit", "fields"];

  // remove any of the fields in the array that match the query
  excludeFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte)\b/g, (match) => `$${match}`);

  let query = Product.find(JSON.parse(queryStr));

  // SORTING
  // localhost:5000/api/product/?sort=category,brand
  if (sortQuery) {
    const sortBy = sortQuery.split(",").join(" ");
    query = query.sort(sortBy);
    // console.log(sortBy, req.query);
  } else {
    query = query.sort("-createdAt");
  }

  // limiting the fields
  // eg localhost:5000/api/product/?fields=title,price,category
  if (fieldsQuery) {
    const fields = fieldsQuery.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v"); // hide the mongodb (__v) property
  }

  // PAGINATION
  // eg localhost:5000/api/product/?page=2&limit=3
  const page = pageQuery;
  const limit = limitQuery;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);
  // validate product skip
  if (page) {
    const productCount = await Product.countDocuments();
    // skip exist product count
    if (skip >= productCount) throw new Error("This page does not exist!");
  }

  const product = await query;
  return product;
};

const handleAddWishlist = async (prodId, _id) => {
  validateMongoDBId(_id);

  const user = await User.findById(_id);
  // check if product is already added to wishlist
  const alreadyWishlisted = user.wishlist.find(
    (id) => id.toString() === prodId
  );

  // ..then remove from wishlist
  if (alreadyWishlisted) {
    let user = await User.findByIdAndUpdate(
      _id,
      {
        $pull: { wishlist: prodId }, //pull id from user wishlist
      },
      { new: true }
    );
    return user;
  } else {
    // add to wishlist
    let user = await User.findByIdAndUpdate(
      _id,
      {
        $push: { wishlist: prodId },
      },
      {
        new: true,
      }
    );
    return user;
  }
};

const handleRating = async (_id, star, comment, prodId) => {
  validateMongoDBId(_id);
  const product = await Product.findById(prodId);

  // Check if the user has already rated the product
  let alreadyRated = product.ratings.find(
    (userId) => userId.postedby.toString === _id.toString()
  );

  // check if rated
  if (alreadyRated) {
    // find rated product
    const updateRating = await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRated },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      {
        new: true,
      }
    );
  } else {
    // update user ratings array with star given and userId
    const rateProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        $push: {
          ratings: {
            star: star,
            comment: comment,
            postedby: _id,
          },
        },
      },
      { new: true }
    );
  }

  //   calculate total ratings
  //   const getTotalRatings = await Product.findById(prodId);
  const totalRating = product.ratings.length;
  let sumOfTotalRatings = product.ratings
    .map((item) => item.star)
    .reduce((prev, curr) => prev + curr, 0);

  // divide sum of total rating
  let actualRating = Math.round(sumOfTotalRatings / totalRating);

  // update total rating object in product model
  let finalProductRating = await Product.findByIdAndUpdate(
    prodId,
    {
      totalRating: actualRating,
    },
    { new: true }
  );
  return finalProductRating;
};

const handleUploadProdImages = async (filesQuery) => {
  // call the cloudinary config from utils
  const uploader = (path) => cloudinaryImageUpload(path, "images");

  // create array for image url and get files uploaded from request
  const urls = [];

  // get image files and push to array
  for (const file of filesQuery) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath);
    fs.unlinkSync(path);
  }

  // update particular images by updating the schema
  // NB: Must be more than one
  const images = urls.map((file) => {
    return file;
  });

  return images;
};

const handleProdImagesDelete = async (public_id) => {
  const deleteImage = await cloudinaryDeleteUpload(public_id);
  return;
};

module.exports = {
  createNewProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleGetProduct,
  handleGetAllProducts,
  handleAddWishlist,
  handleRating,
  handleUploadProdImages,
  handleProdImagesDelete,
};
