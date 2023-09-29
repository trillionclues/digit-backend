const mongoose = require('mongoose');
require('dotenv').config();

const mySecret = process.env.MONGODB_URL;

// connect to mongodb
const dbConnect = () => {
  try {
    const conn = mongoose.connect(mySecret, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to Database');
  } catch (error) {
    throw new Error('Error connecting to MongoDB:', error);
  }
};

module.exports = { dbConnect };
