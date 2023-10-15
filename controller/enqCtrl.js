const asyncHandler = require("express-async-handler");

const {
  createNewEnquiry,
  handleUpdateEnquiry,
  handleDeleteEnquiry,
  handleGetEnquiry,
  handleGetAllEnquiry,
} = require("../Service/Enquiry/enquiryService");

// create new enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnq = await createNewEnquiry(req.body);
    res.json(newEnq);
  } catch (error) {
    throw new Error(error);
  }
});

// update enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEnquiry = await handleUpdateEnquiry(id, req.body);
    res.json(updatedEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

// delete enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEnquiry = await handleDeleteEnquiry(id);
    res.json({ deletedEnquiry });
  } catch (error) {
    throw new Error(error);
  }
});

// get a single enquiry
const getSingleEnquiry = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const getEnquiry = await handleGetEnquiry(id);
    res.json(getEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

// get all enquiries
const getAllEnquiry = asyncHandler(async (req, res) => {
  try {
    const getEnquiries = await handleGetAllEnquiry();
    res.json(getEnquiries);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createEnquiry,
  deleteEnquiry,
  getSingleEnquiry,
  getAllEnquiry,
  updateEnquiry,
};
