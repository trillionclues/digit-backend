const asyncHandler = require("express-async-handler");
const { validateMongoDBId } = require("../utils/validateMongoId");
const Color = require("../models/colorModel");
const {
  handleCreateColor,
  handleUpdateColor,
  handleGetColor,
  getAllColors,
  handleDeleteColor,
} = require("../Service/Color/colorService");

// create new color
const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await handleCreateColor(req.body);
    res.json(newColor);
  } catch (error) {
    throw new Error(error);
  }
});

// update color
const updateColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedColor = await handleUpdateColor(id, req.body);
    res.json(updatedColor);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single color
const getSingleColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const getColor = await handleGetColor(id);
    res.json(getColor);
  } catch (error) {
    throw new Error(error);
  }
});

// get all colors
const getAllColor = asyncHandler(async (req, res) => {
  try {
    const getColors = await getAllColors();
    res.json(getColors);
  } catch (error) {
    throw new Error(error);
  }
});
// delete color category
const deleteColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedColor = await handleDeleteColor(id);
    res.json({ deletedColor });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createColor,
  updateColor,
  getSingleColor,
  getAllColor,
  deleteColor,
};
