const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

// verify jwt token
const authMiddleware = asyncHandler(async (req, res, next) => {
  // extract and verify from the request headers
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      // verify if token is valid, expired
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // find decoded user id
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error('Not Authorized, token expired. Please login again!');
    }
  } else {
    throw new Error('There is no token attached to header');
  }
});

// role-check middleware
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  try {
    // find user doc
    const adminUser = await User.findOne({ email });

    // check if role matches admin
    if (adminUser.role !== 'admin') {
      throw new Error('You are not an admin!');
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { authMiddleware, isAdmin };
