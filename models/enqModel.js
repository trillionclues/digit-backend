const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enqSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Submitted",
    enum: ["Submitted", "Pending", "In Progress"],
  },
});

module.exports = mongoose.model("Enquiry", enqSchema);
