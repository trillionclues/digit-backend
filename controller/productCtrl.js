const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const { validateMongoDBId } = require('../utils/validateMongoId');

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
    // destructure query object
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte)\b/g, (match) => `$${match}`);

    // remove any of the fields in the array that match the query
    queryObj2 = excludeFields.forEach((el) => delete queryObj[el]);

    // console.log(queryObj, req.query);
    let query = Product.find(JSON.parse(queryStr));

    // SORTING
    // localhost:5000/api/product/?sort=category,brand
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',').map((field) => {
        if (field.startsWith('-')) {
          return [`-${field.slice(1)}`]; // Sort in descending order
        }
        return [field]; // Sort in ascending order
      });

      const flattendSortFields = sortFields.reduce(
        (acc, val) => acc.concat(val),
        []
      );
      console.log(flattendSortFields);

      query = query.sort(flattendSortFields);
    } else {
      query = query.sort('-createdAt');
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
