const mongoose = require("mongoose")
const { Schema } = mongoose;
const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  subtitle: String,
  image: {
    type: String,
    required: true
  },
  siteLink: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  level: String,
  language: String,
  brand: String,
  color: String,
  rating: Number,
  offer: Number,
  inStock: Boolean,
  isFastDelivery: Boolean,
  categoryName: String,
});


const Product = mongoose.model('Product', productSchema);

module.exports = { Product }