const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const { validateMongoDBId } = require('../utils/validateMongoId');
const { generateRefreshToken } = require('../config/refreshToken');

// create new user
const createUser = asyncHandler(async (req, res) => {
  // check if user exist
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  // create new user
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error('User already exist');
  }
});

// login controller
const loginUserCtrl = asyncHandler(async (req, res) => {
  // get email and password from request body
  const { email, password } = req.body;

  // check if user exists and compare with encrypted passeord
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    // generate a refreshToken for user
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUserStatus = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, //cookie expires in 72hrs to match config
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error('Invalid credentials');
  }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
});

// Get all user
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// update a user
const updateUser = asyncHandler(async (req, res) => {
  // const {id} = req.params

  // only allow verified admin instead to update
  const { _id } = req.user;
  validateMongoDBId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        mobile: req?.body?.mobile,
        email: req?.body?.email,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (err) {
    throw new Error(err);
  }
});

// Get a single user
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // validate mongoid
  validateMongoDBId(id);
  try {
    const getUser = await User.findById(id);
    res.json({ getUser });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const deleteSingleUser = await User.findByIdAndDelete(id);
    res.json({ deleteSingleUser });
  } catch (error) {
    throw new Error(error);
  }
});

// block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const blocked = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: 'User blocked!',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const unblocked = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: 'User unblocked!',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// exports
module.exports = {
  createUser,
  loginUserCtrl,
  handleRefreshToken,
  updateUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  blockUser,
  unblockUser,
};
