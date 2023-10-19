const { generateRefreshToken } = require("../../config/refreshToken");
const { validateMongoDBId } = require("../../utils/validateMongoId");
const { generateToken } = require("../../config/jwtToken");
const sendEmail = require("../../controller/emailCtrl");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const Coupon = require("../../models/couponModel");
const Order = require("../../models/orderModel");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uniqid = require("uniqid");

// create new user
const createNewUser = async (body) => {
  const email = body.email;

  // check if user exists in db
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(body);
    return newUser;
  } else {
    throw new Error("User already exist");
  }
};

// user login
const userLogin = async (data) => {
  // get email and password from request body
  const { email, password } = data;

  // check if user exists and compare with encrypted password
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    // generate a refreshToken for user
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updatedUser = await User.findByIdAndUpdate(
      findUser?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    return {
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
      refreshToken,
    };
  } else {
    throw new Error("Invalid credentials");
  }
};

const adminLogin = async (data) => {
  const { email, password } = data;

  // check if user exists and compare with encrypted password
  const findAdmin = await User.findOne({ email });

  // check if found user is an admin
  if (findAdmin.role !== "admin") throw new Error("Not Authorized");

  // else if found user is an admin
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    // generate refreshtoken for user
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateUserStatus = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );

    return {
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
      refreshToken,
    };
  } else {
    throw new Error("Invalid credentials");
  }
};

const tokenRefresh = async (refreshToken) => {
  // find the exact user with the refresh token
  const findUser = await User.findOne({ refreshToken });
  if (!findUser) throw new Error("No refresh token found in DB or no match");

  // Verify the refresh token with JWT
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || findUser.id !== decoded.id) {
        reject("There is something wrong with the refresh token");
      }

      // Generate a new access token
      const accessToken = generateToken(findUser._id);
      resolve({ accessToken });
    });
  });
};

const logoutService = async (refreshToken) => {
  if (!refreshToken) {
    // No refreshToken found, clear the cookie and return success status
    return { success: true };
  }

  //fid exact user with the refresh token and clear token
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

  return { success: true };
};

const getUsers = async () => {
  const user = await User.find();
  return user;
};

const userUpdate = async (body) => {
  const { _id, firstname, lastname, mobile, email } = body;
  validateMongoDBId(_id);

  // Construct the update object for User.findByIdAndUpdate
  const updateData = {
    firstname,
    lastname,
    mobile,
    email,
  };
  // update identified user
  const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
    new: true,
  });
  return updatedUser;
};

const singleUser = async (data) => {
  const { id } = data;
  validateMongoDBId(id);

  const getUser = await User.findById(id);
  return getUser;
};

const handleDeleteUser = async (data) => {
  const { id } = data;
  validateMongoDBId(id);
  const deleteUser = await User.findByIdAndDelete(id);
  return deleteUser;
};

const handleBlockUser = async (userId) => {
  validateMongoDBId(userId);
  const blockUser = await User.findByIdAndUpdate(
    userId,
    {
      isBlocked: true,
    },
    { new: true }
  );
  return blockUser;
};

const handleUnblockUser = async (userId) => {
  validateMongoDBId(userId);
  const unblocked = await User.findByIdAndUpdate(
    userId,
    {
      isBlocked: false,
    },
    { new: true }
  );
  return unblocked;
};

const handlePasswordUpdate = async (_id, newPassword) => {
  validateMongoDBId(_id);
  const user = await User.findById(_id);

  if (newPassword) {
    user.password = newPassword;

    // update and save password
    const updatePassword = await user.save();
    return updatePassword;
  } else {
    return user;
  }
};

const handleSaveUserAddress = async (_id, address) => {
  validateMongoDBId(_id);
  const userAddress = await User.findByIdAndUpdate(
    _id,
    {
      address: address,
    },
    { new: true }
  );
  return userAddress;
};

const handleforgotPasswordToken = async (email) => {
  // find the user with email
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");

  // if user found...create token
  // use same method in user model that returns resetToken
  const token = await user.createPasswordResetToken();
  await user.save();

  // create reset url
  const resetURL = `Hi, Please follow this link to reset your password. This link is valid for 10 minutes from now. <a href='https://digit-backend.adaptable.app/api/user/reset-password/${token}'>Click  Here</>`;

  // create data object for email controller (emailCtrl)
  const data = {
    to: email,
    text: "Hey User",
    subject: "Forgot Password Link",
    htm: resetURL,
  };

  // pass the data to sendEMail
  sendEmail(data);

  return token;
};

const handleResetUserPassword = async (token, newPassword) => {
  //  hash the token parameter in the rq and search for user with matching passwordResetToken in the db
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // find user with hashed token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // handle user not found
  if (!user) throw new Error("Token expired. Please try again later!");

  // else handle change password
  user.password = newPassword;
  //because password is changed and we dont need it anymore
  user.passwordResetToken = undefined;

  // save new user password and return user
  await user.save();
  return user;
};

const handleGetWishlist = async (_id) => {
  validateMongoDBId(_id);

  const getWish = await User.findById(_id).populate("wishlist");
  return getWish;
};

const AddToUserCart = async (cart, _id) => {
  validateMongoDBId(_id);

  let products = []; // array to stor cart products
  const user = await User.findById(_id);

  // Check if there's an existing cart for the user and delete if found
  const activeCart = await Cart.findOne({ orderby: user._id });
  if (activeCart) {
    activeCart.deleteOne();
  }

  // if no products in cart, map through and create cart
  for (let i = 0; i < cart.length; i++) {
    // Create an empty object to represent a product.
    // Assign the product's '_id', 'count' and 'color' to their respective property.
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;

    // / Find the product and select its 'price' field to calculate price of products in cart
    let getPrice = await Product.findById(cart[i]._id).select("price").exec();

    // store the price in the object
    object.price = getPrice.price;
    products.push(object);
  }

  // find the total price of the cart
  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    // multiply the price of each product by its count and accumulate to calculate the total.
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  // set a new cart with the user's products and total price
  let newCart = await new Cart({
    products, // Assign 'products' array to 'products' field of new cart.
    cartTotal, // Assign user's '_id' to 'orderby' field of new cart.
    orderby: user?._id,
  }).save();

  return newCart;
};

const handleGetUserCart = async (_id) => {
  validateMongoDBId(_id);
  // find user cart based on id
  const userCart = await Cart.findOne({ orderby: _id }).populate(
    "products.product"
  );
  return userCart;
};

const handleEmptyUserCart = async (_id) => {
  validateMongoDBId(_id);
  const user = await User.findOne(_id);
  const cart = await Cart.findOneAndRemove({ orderby: user._id }); //remove user cart
  return cart;
};

const handleApplyCoupon = async (coupon, _id) => {
  validateMongoDBId(_id);

  // find user and their cart
  const user = await User.findOne({ _id });
  const cart = await Cart.findOne({ orderby: user._id });

  // find coupon and match the one in db
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid coupon");
  }

  // check if cart is empty
  if (!cart || !cart.products || cart.products.length === 0) {
    throw new Error("User's cart is empty!");
  }

  // calculate cart total after applyig ncoupon
  let { cartTotal } = await Cart.findOne({ orderby: user._id }).populate(
    "products.product"
  );

  console.log("Cart Total:", cartTotal);

  // calculate user cart total after applying coupon
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  console.log("Total After Discount:", totalAfterDiscount);

  // update user cart
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  return totalAfterDiscount;
};

const handleCreateOrder = async (_id, cashOnDelivery, couponApplied) => {
  validateMongoDBId(_id);

  // if not COD
  if (!cashOnDelivery) throw new Error("Create cash order failed!");
  const user = await User.findById(_id);

  // find user cart
  let userCart = await Cart.findOne({ orderby: user._id });

  // check if cart is empty
  if (!userCart || !userCart.products || userCart.products.length === 0) {
    throw new Error("Your cart is empty!");
  }

  let finalAmount = 0;

  if (couponApplied && userCart.totalAfterDiscount) {
    // calculate finalamount for order
    finalAmount = userCart.totalAfterDiscount;
  } else {
    finalAmount = userCart.cartTotal;
  }

  // create order using orderModel
  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqid(),
      method: "cashOnDelivery",
      amount: finalAmount,
      status: "Cash on Delivery",
      created: Date.now(),
      currency: "usd",
    },
    orderby: user._id,
    orderStatus: "Cash on Delivery",
  }).save();

  // increase and decrease amount of sold quantity and product quantity
  let update = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  const updatedQuantity = await Product.bulkWrite(update, {});

  // return message
  return;
};

const handleGetOrder = async (_id) => {
  validateMongoDBId(_id);
  const userOrders = await Order.findOne({ orderby: _id })
    .populate("products.product")
    .exec();
  return userOrders;
};

const handleUpdateOrder = async (status, id) => {
  validateMongoDBId(id);

  const findAndUpdateOrderStatus = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus: status,
      paymentIntent: {
        status: status,
      },
    },
    { new: true }
  );
  return findAndUpdateOrderStatus;
};

module.exports = {
  createNewUser,
  userLogin,
  adminLogin,
  tokenRefresh,
  logoutService,
  getUsers,
  userUpdate,
  singleUser,
  handleDeleteUser,
  handleBlockUser,
  handleUnblockUser,
  handlePasswordUpdate,
  handleSaveUserAddress,
  handleforgotPasswordToken,
  handleResetUserPassword,
  handleGetWishlist,
  AddToUserCart,
  handleGetUserCart,
  handleEmptyUserCart,
  handleApplyCoupon,
  handleCreateOrder,
  handleGetOrder,
  handleUpdateOrder,
};
