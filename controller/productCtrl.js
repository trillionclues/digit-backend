const Product = require('../models/productModel');
const User = require("../models/userModel")
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const fs = require('fs')
const { validateMongoDBId } = require('../utils/validateMongoId');
const {cloudinaryImageUpload, cloudinaryDeleteUpload} = require('../utils/cloudinary')

// create new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    // slugify title
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    // create new product
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    throw new Error(err);
  }
});

// update a product
const updateProduct = asyncHandler(async (req, res) => {
  // update product with params
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    // Use the filter object to update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found!' });
    }

    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const deleteSingleProduct = await Product.findByIdAndDelete(id);
    res.json({ deleteSingleProduct });
  } catch (err) {
    throw new Error(err);
  }
});

// get single product from params
const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // validate mongo id
  validateMongoDBId(id);
  try {
    const getProduct = await Product.findById(id);
    res.json({ getProduct });
  } catch (err) {
    throw new Error(err);
  }
});

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
  // request params
  // console.log(req.query);
  // wait Product.find({ brand: req.query.brand;
  // await Product.where('category').equals(req.query.category)

  try {
    // handle queryStrings for FILTERING...
    // eg localhost:5000/api/product/?brand=Apple&price[gte]=9000&price[lte]=20000
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // remove any of the fields in the array that match the query
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // SORTING
    // localhost:5000/api/product/?sort=category,brand
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      console.log(sortBy, req.query);
    } else {
      query = query.sort('-createdAt');
    }

    // limiting the fields
    // eg localhost:5000/api/product/?fields=title,price,category
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // hide the mongodb (__v) property
    }

    // PAGINATION
    // eg localhost:5000/api/product/?page=2&limit=3
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    // validate product skip
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      // skip exist product count
      if (skip >= productCount) throw new Error('This page does not exist!');
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});


// add to wishlist
const addToWishList = asyncHandler(async (req, res) => {
  // get user from authmiddleware and product id from requesr body
  const {prodID} = req.body
  const {_id} = req.user
  validateMongoDBId(_id)

  try {
    // find the user
    const user = await User.findById(_id)

    // check if product already added to wishlist
    const alreadyWishlisted = user.wishlist.find((id) => id.toString() === prodID)
    // ...then remove from wishlist
    if(alreadyWishlisted){
      let user = await User.findByIdAndUpdate(_id, {
        $pull: {wishlist: prodID}  //pull the prod id from the user wishlist
      }, {
        new: true
      })
      res.json(user)
    }
    else{
      // add to wishlist
      let user = await User.findByIdAndUpdate(_id, {
        $push: {wishlist: prodID}
      },{
        new: true
      })
      res.json(user)
    }
  } catch (error) {
    throw new Error(error)
  }

});

// add rating

const rating = asyncHandler(async(req, res) => {
  const {_id} = req.user
  const {star, comment, prodID} = req.body


  try {
  // check if product already rated by user
  const product = await Product.findById(prodID)
  let alreadyRated = product.ratings.find((userId) => userId.postedby.toString === _id.toString())
  
  if (alreadyRated) {
    // find the rated product
    const updateRating = await Product.updateOne({
      ratings: { $elemMatch: alreadyRated},
    }, {
      $set: {"ratings.$.star": star, "ratings.$.comment": comment},
    }, {
      new: true
    })
    // res.json(updateRating)
  }
  else{
    // update the user ratings array with the star given and user id 
    const rateProduct = await Product.findByIdAndUpdate(prodID, {
      $push: {
        ratings: {
          star: star,
          comment: comment,
          postedby: _id
        }
      }
    }, {
      new: true
    })
    // res.json(rateProduct)
  }

  // calculate total ratings
  const getTotalRatings = await Product.findById(prodID)
  const totalRating = getTotalRatings.ratings.length
  let sumOfTotalRatings = getTotalRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0)
  // divide sum of total rating
  let actualRating = Math.round(sumOfTotalRatings / totalRating)
  // update total rating object in product model
  let finalProductRating = await Product.findByIdAndUpdate(prodID, {
    totalRating: actualRating
  }, {
    new: true
  })
  res.json(finalProductRating)
  } catch (error) {
    throw new Error(error)
  }
})


// upload product images
const uploadProdImages = asyncHandler(async(req, res) => {
  try {
    // call the cloudinary config from utils
    const uploader = (path) => cloudinaryImageUpload(path, "images");

    // create array for image url and get files uploaded from request
    const urls = []
    const files = req.files
    
    // get image files and push to array
    for (const file of files) {
      const {path} = file
      const newPath  = await uploader(path)
      urls.push(newPath)
      fs.unlinkSync(path)
    }

    // update particular images by updating the schema
    // NB: Must be more than one 
    const images = urls.map((file) => {
      return  file;
    });
    res.json(images)
  } catch (error) {
    throw new Error(error)
  }
})

// delete product images from cloudinary
const deleteProdImages = asyncHandler(async (req, res) => {
  // get the pubic_id from params using JS object keys
  const public_id = req.params.public_id;

  try {
    const deleted = await cloudinaryDeleteUpload(public_id);
    res.json({message: "Images successfully deleted!"})
  } catch (error) {
    throw new Error(error)
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
  deleteProdImages
};
