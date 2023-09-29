const express = require('express');
const {
  createUser,
  loginUserCtrl,
  updateUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

//  user controller
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/all-users', getAllUsers);
router.get('/:id', authMiddleware, isAdmin, getSingleUser);
router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser);

module.exports = router;
