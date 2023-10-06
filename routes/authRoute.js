const express = require('express');
const {
  createUser,
  loginUserCtrl,
  updateUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  blockUser,
  unblockUser,
  handleTokenRefresh,
  handleLogout,
  updatePassword,
  forgotPasswordToken,
  resetUserPassword,
  adminLoginCtrl,
  getWishlist,
  saveUserAddress
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

//  user controller
router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetUserPassword);
router.post('/password', authMiddleware, updatePassword);
router.post('/login', loginUserCtrl);
router.post('/admin-login', adminLoginCtrl);
router.get('/logout', handleLogout);
router.get('/wishlist', authMiddleware, getWishlist);

// These specific routes should come before the dynamic ones else...otilorr
router.get('/all-users', getAllUsers);
router.get('/refresh', handleTokenRefresh);
router.get('/:id', authMiddleware, isAdmin, getSingleUser);

router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/save-address', authMiddleware, saveUserAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;
