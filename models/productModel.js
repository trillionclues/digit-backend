const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Category',
    },
    brand: {
      type: String,
      required: true,
      // enum: ['Apple', 'Samsung', 'Lenovo'],
    },
    sold: {
      type: Number,
      default: 0,
      // select: false,  hide schema from user
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      required: true,
      // enum: ['Black', 'Brown', 'Red'],
    },
    ratings: [
      {
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
