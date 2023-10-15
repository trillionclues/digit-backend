const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");

const {
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
} = require("../Service/User/userService");

// create new user
const createUser = asyncHandler(async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await createNewUser(userData);
    res.json(newUser);
  } catch (error) {
    throw new Error(error);
  }
});

// login controller
const loginUserCtrl = asyncHandler(async (req, res) => {
  try {
    const user = await userLogin(req.body);

    // Set the refreshToken as an HTTP-only cookie
    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, //cookie expires in 72hrs to match config
    });

    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      mobile: user.mobile,
      token: generateToken(user._id),
    });
  } catch (error) {
    throw new Error(error);
  }
});

// admin login
const adminLoginCtrl = asyncHandler(async (req, res) => {
  try {
    const user = await adminLogin(req.body);

    // return user encrypted data with refresh token
    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // expires in 72hrs
    });

    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      mobile: user.mobile,
      token: generateToken(user._id),
    });
  } catch (error) {
    throw new Error(error);
  }
});

// handle refresh token
const handleTokenRefresh = asyncHandler(async (req, res) => {
  try {
    // get token from https headers
    const cookie = req.cookies;

    if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies!");
    const refreshToken = cookie.refreshToken;

    const result = await tokenRefresh(refreshToken);
    res.json({ result });
  } catch (error) {
    throw new Error(error);
  }
});

// logout functionality
const handleLogout = asyncHandler(async (req, res) => {
  try {
    // get token from cookies
    const refreshToken = req.cookies.refreshToken;

    // handle logout
    const result = await logoutService(refreshToken);

    // clear refrehstoken cookies
    res.clearCookie("refreshToken", {
      httpsOnly: true,
      secure: true,
    });

    res.sendStatus(204);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all user
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});

// update a user
const updateUser = asyncHandler(async (req, res) => {
  try {
    const data = req.body; //should contain first, last, email,
    const updatedUser = await userUpdate(data);
    res.json(updatedUser);
  } catch (err) {
    throw new Error(err);
  }
});

// Get a single user
const getSingleUser = asyncHandler(async (req, res) => {
  const userId = req.params;

  try {
    const getUser = await singleUser(userId);
    res.json({ getUser });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params;
  try {
    const deleteSingleUser = await handleDeleteUser(userId);
    res.json({ deleteSingleUser });
  } catch (error) {
    throw new Error(error);
  }
});

// block user
const blockUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const blocked = await handleBlockUser(userId);
    res.json({
      message: "User blocked!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// unblock user
const unblockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const unblocked = await handleUnblockUser(id);
    res.json({
      message: "User unblocked!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update password
const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { password } = req.body;
    const updatedPassword = await handlePasswordUpdate(_id, password);
    res.json(updatedPassword);
  } catch (error) {
    throw new Error(error);
  }
});

// save user address
const saveUserAddress = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { address } = req.body;
    const updateUserAddress = await handleSaveUserAddress(_id, address);
    res.json(updateUserAddress);
  } catch (error) {
    throw new Error(error);
  }
});

// forgot password token
const forgotPasswordToken = asyncHandler(async function (req, res) {
  try {
    const { email } = req.body;
    const userToken = await handleforgotPasswordToken(email);
    res.json(userToken);
  } catch (error) {
    throw new Error(error);
  }
});

// reset password after getting forgot password token
const resetUserPassword = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    const user = await handleResetUserPassword(token, password);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// get user wishlist
const getWishlist = asyncHandler(async (req, res) => {
  try {
    // get user with id trough authmiddleware
    const { _id } = req.user;
    const getUserWishlist = await handleGetWishlist(_id);
    res.json(getUserWishlist);
  } catch (error) {
    throw new Error(error);
  }
});

// create user cart
const userCart = asyncHandler(async (req, res) => {
  try {
    const { cart } = req.body;
    const { _id } = req.user;
    const newCart = await AddToUserCart(cart, _id);
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

// get user cart
const getUserCart = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const userCart = await handleGetUserCart(_id);
    // check if cart exists || empty
    if (!userCart) {
      return res.json({ message: "Cart is empty" });
    }
    res.json(userCart);
  } catch (error) {
    throw new Error(error);
  }
});

// empty user cart
const emptyUserCart = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const cart = await handleEmptyUserCart(_id);
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

// apply coupon to user cart
const applyCoupon = asyncHandler(async (req, res) => {
  try {
    const { coupon } = req.body;
    const { _id } = req.user;
    const appliedDiscount = await handleApplyCoupon(coupon, _id);
    res.json(appliedDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

// create user order
const createOrder = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { cashOnDelivery, couponApplied } = req.body;
    const fulfiledOrder = await handleCreateOrder(
      _id,
      cashOnDelivery,
      couponApplied
    );
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

// get user orders
const getOrders = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const userOrder = await handleGetOrder(_id);
    res.json(userOrder);
  } catch (error) {
    throw new Error(error);
  }
});

// update user order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    // find the user order stats
    const { status } = req.body;
    const { id } = req.params;
    const findAndUpdateOrderStatus = await handleUpdateOrder(status, id);
    res.json(findAndUpdateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

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
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
};
