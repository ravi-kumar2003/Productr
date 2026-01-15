const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  mrp: {
    type: Number,
    min: 0,
  },
  sellingPrice: {
    type: Number,
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: 0,
    default: 0,
  },
  exchangeEligible: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
