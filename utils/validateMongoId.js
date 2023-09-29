const mongoose = require('mongoose');
const validateMongoDBId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error('This ID is not found or invalid');
};

module.exports = { validateMongoDBId };
