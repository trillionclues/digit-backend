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
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

//  user controller
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/logout', handleLogout);

// These specific routes should come before the dynamic ones else...otilorr
router.get('/all-users', getAllUsers);
router.get('/refresh', handleTokenRefresh);
router.get('/:id', authMiddleware, isAdmin, getSingleUser);

router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;
