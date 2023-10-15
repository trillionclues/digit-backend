const Color = require("../../models/colorModel");
const { validateMongoDBId } = require("../../utils/validateMongoId");

const handleCreateColor = async (body) => {
  const newColor = await Color.create(body);
  return newColor;
};

const handleUpdateColor = async (id, body) => {
  validateMongoDBId(id);
  const updateColor = await Color.findByIdAndUpdate(id, body, { new: true });
  return updateColor;
};

const handleGetColor = async (id) => {
  validateMongoDBId(id);
  const getColor = await Color.findById(id);
  return getColor;
};

const getAllColors = async () => {
  const getColors = await Color.find();
  return getColors;
};

const handleDeleteColor = async (id) => {
  validateMongoDBId(id);
  const deleteColor = await Color.findByIdAndDelete(id);
  return deleteColor;
};

module.exports = {
  handleCreateColor,
  handleUpdateColor,
  handleGetColor,
  getAllColors,
  handleDeleteColor,
};
