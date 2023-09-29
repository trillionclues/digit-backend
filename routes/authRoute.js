const express = require('express');
const {
  createUser,
  loginUserCtrl,
  updateUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
} = require('../controller/userCtrl');
const router = express.Router();

//  user controller
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/all-users', getAllUsers);
router.get('/:id', getSingleUser);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

module.exports = router;
