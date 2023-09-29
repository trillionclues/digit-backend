const jwt = require('jsonwebtoken');

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' }); //cookie expires in 72hrs
};

module.exports = { generateRefreshToken };
