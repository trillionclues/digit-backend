const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const { validateMongoDBId } = require('../utils/validateMongoId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const crypto = require("crypto")
const sendEmail = require('./emailCtrl');


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

  // check if user exists and compare with encrypted password
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

// admin login
const adminLoginCtrl = asyncHandler(async(req, res) => {
  const {email, password} = req.body

    // check if user exists and compare with encrypted password
    const findAdmin = await User.findOne({email})

    // check if found user is an admin
    if (findAdmin.role !== 'admin') throw new Error("Not Authorized")

    // else if found user is an admin
    if (findAdmin && (await findAdmin.isPasswordMatched(password))){

      // generate refreshtoken for user
      const refreshToken = await generateRefreshToken(findAdmin?._id)
      const updateUserStatus = await User.findByIdAndUpdate(findAdmin.id, {
        refreshToken: refreshToken
      }, {
        new: true
      });
      
      // return user encrypted data with refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000 // expires in 72hrs
      });
      res.json({
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        mobile: findAdmin?.mobile,
        token: generateToken(findAdmin?._id)
      });
    }
    else {
      throw new Error("Invalid credentials")
    }
})

// handle refresh token
const handleTokenRefresh = asyncHandler(async (req, res) => {
  // get token from https headers
  const cookie = req.cookies;

  if (!cookie?.refreshToken) throw new Error('No refresh token in Cookies!');
  const refreshToken = cookie.refreshToken;

  // find the exact user with the refresh token
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('No refresh token found in DB or no match');

  // if there is match, verify with jwt
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error('There is something wrong with the refresh token');
    }

    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality
const handleLogout = asyncHandler(async (req, res) => {
  // get token from cookies
  const refreshToken = req.cookies.refreshToken;

  // // find the exact user with the refresh token
  // const user = await User.findOne({ refreshToken });

  if (!refreshToken) {
    res.clearCookie('refreshToken', {
      httpsOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //No content
  }

  // find exact user with the refresh token and clear token
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' });

  res.clearCookie('refreshToken', {
    httpsOnly: true,
    secure: true,
  });
  res.sendStatus(204);
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

// update password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDBId(_id);

  // find user with the id
  const user = await User.findById(_id);
  if (password) {
    user.password = password;

    // update and save password
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

// save user address
const saveUserAddress = asyncHandler(async(req, res) => {
  const {_id} = req.user
  validateMongoDBId(_id)
  try {
    const userAddress = await User.findByIdAndUpdate(_id, {
      "address": req?.body?.address
    }, {
      new: true
    })
    res.json(userAddress)
  } catch (error) {
    throw new Error(error)
  }
})

// forgot password token
const forgotPasswordToken = asyncHandler(async function (req, res) {
  // find user with user email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found with this email');

  // if user found...create token
  try {
    // use same method in user model that returns resetToken
    const token = await user.createPasswordResetToken();
    await user.save();

    // create reset url
    const resetURL = `Hi, Please follow this link to reset your password. This link is valid for 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password-token/${token}'>Click  Here</>`;

    // create data object for email controller (emailCtrl)
    const data = {
      to: email,
      text: 'Hey User',
      subject: 'Forgot Password Link',
      htm: resetURL,
    };
    // pass the data to sendEMail
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// reset password after getting forgot password token
const resetUserPassword = asyncHandler(async(req, res) => {
  const {password} = req.body
  const {token} = req.params

  //  hash the token parameter in the rq and search for user with matching passwordResetToken in the db
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // find user with hashed token
  const user = await User.findOne({
    passwordResetToken: hashedToken, 
    passwordResetExpires: { $gt: Date.now() }
  });

  // user not found or token expired
  if (!user) throw new Error("Token expired. Please try again later!")

  // else....
  user.password = password
  user.passwordResetToken = undefined; //because our password is changed and we dont need it anymore
  user.passwordResetExpires = undefined

  // save new user details and return user
  await user.save()
  res.json(user)
})

// get user wishlist 
const getWishlist = asyncHandler(async(req, res) => {
  // get user with id trough authmiddleware
  const {_id} = req.user;
  validateMongoDBId(_id)
  try {
    // return user wishlist and populate wishlist field
    const getWish = await User.findById(_id).populate("wishlist")
    res.json(getWish)
  } catch (error) {
    throw new Error(error)
  }
})


// create user cart
const userCart = asyncHandler(async(req, res) => {
  const {cart} = req.body
  const {_id} = req.user
  validateMongoDBId(_id)  
  try {
    let products = [] //array to stor cart products
    const user = await User.findById(_id)

    // Check if there's an existing cart for the user and delete if found
    const activeCart  = await Cart.findOne({orderby: user._id})
    if (activeCart){
      activeCart.deleteOne()
    }

    // if no products in cart, map through and create cart
    for(let i = 0; i < cart.length; i++){
      // Create an empty object to represent a product.
      // Assign the product's '_id', 'count' and 'color' to their respective property.
      let object = {} 
      object.product = cart[i]._id
      object.count = cart[i].count
      object.color = cart[i].color

      // / Find the product and select its 'price' field to calculate price of products in cart
      let getPrice = await Product.findById(cart[i]._id).select("price").exec()

      // store the price in the object
      object.price = getPrice.price
      products.push(object)
    }

    // find the total price of the cart
    let cartTotal = 0
    for (let i = 0; i < products.length; i++){
      // multiply the price of each product by its count and accumulate to calculate the total.
      cartTotal =  cartTotal + products[i].price * products[i].count
    }
    // console.log(products, cartTotal)

    // set a new cart with the user's products and total price
    let newCart = await new Cart({
      products, // Assign 'products' array to 'products' field of new cart.
      cartTotal, // Assign user's '_id' to 'orderby' field of new cart.
      orderby: user?._id
    }).save()

    res.json(newCart)
    
  } catch (error) {
    throw new Error(error)
  }
})

// get user cart
const getUserCart = asyncHandler(async(req, res) =>{
  const {_id}= req.user
  validateMongoDBId(_id)

  try {
    // find user cart based on id
    const userCart = await Cart.findOne({orderby: _id}).populate("products.product")

    // check if cart exists || empty
    if (!userCart) {
      return res.json({message: "Cart is empty"})
    }

    res.json(userCart)

    
  } catch (error) {
    throw new Error(error)
  }
} )

// empty user cart
const emptyUserCart = asyncHandler(async(req, res) => {
  const {_id}= req.user
  validateMongoDBId(_id)
  try {
    const user = await User.findOne(_id) // find user
    const cart = await Cart.findOneAndRemove({orderby: user._id}) //remove user cart
    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
})

// apply coupon
const applyCoupon = asyncHandler(async(req, res) => {
  const {coupon} = req.body
  const {_id} = req.user
  validateMongoDBId(_id)

  // find coupon and match the one in DB
  const validCoupon = await Coupon.findOne({name: coupon}) 
  if (validCoupon === null) {
    throw new Error("Invalid coupon!")
  }

  // else find the user and apply coupon to product
  const user = await User.findOne({_id})
  let { cartTotal} = await Cart.findOne({orderby: user._id}).populate("products.product")

  // calculate user cart total after applying coupon
  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);
  
  // update user cart
  await Cart.findOneAndUpdate({orderby: user._id}, {totalAfterDiscount}, {new: true})

  // return the response
  res.json(totalAfterDiscount)
})

// create order
const createOrder = asyncHandler(async(req, res) => {
  const {_id} = req.user
  validateMongoDBId(_id)
  const {CashOnDelivery, couponApplied} = req.body

  try {
    if (!CashOnDelivery) throw new Error("Create cash order failed!")
    const user = await User.findById(_id)

    // find user cart
    let userCart = await Cart.findOne({orderby: user._id})
    let finalAmount = 0

    if(couponApplied && userCart.totalAfterDiscount){
      // calculate finalamount for order
      finalAmount  = userCart.totalAfterDiscount * 100;
    }
    else{
      finalAmount = userCart.cartTotal * 100;
    }

    // create order using orderModel
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {},
    })
  } catch (error) {
    throw new Error(error)
  }
})

// exports
module.exports = {
  createUser,
  loginUserCtrl,
  handleTokenRefresh,
  updateUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  blockUser,
  unblockUser,
  handleLogout,
  updatePassword,
  forgotPasswordToken,
  resetUserPassword,
  adminLoginCtrl,
  getWishlist,
  saveUserAddress,
  userCart,
  getUserCart,
  emptyUserCart,
  applyCoupon
};
