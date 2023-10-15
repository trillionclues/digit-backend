const Enquiry = require("../../models/enqModel");
const { validateMongoDBId } = require("../../utils/validateMongoId");

const createNewEnquiry = async (body) => {
  const newEnq = await Enquiry.create(body);
  return newEnq;
};

const handleUpdateEnquiry = async (id, body) => {
  validateMongoDBId(id);
  const updateEnquiry = await Enquiry.findByIdAndUpdate(id, body, {
    new: true,
  });
  return updateEnquiry;
};

const handleDeleteEnquiry = async (id) => {
  validateMongoDBId(id);
  const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
  return deleteEnquiry;
};

const handleGetEnquiry = async (id) => {
  validateMongoDBId(id);
  const getEnquiry = await Enquiry.findById(id);
  return getEnquiry;
};

const handleGetAllEnquiry = async () => {
  const getEnquiries = await Enquiry.find();
  return getEnquiries;
};

module.exports = {
  createNewEnquiry,
  handleUpdateEnquiry,
  handleDeleteEnquiry,
  handleGetEnquiry,
  handleGetAllEnquiry,
};
