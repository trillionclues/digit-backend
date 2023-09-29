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
  handleRefreshToken,
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

//  user controller
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/all-users', getAllUsers);
router.get('/:id', authMiddleware, isAdmin, getSingleUser);
router.get('/refresh', handleRefreshToken);

router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;
