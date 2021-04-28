const mongoose = require("mongoose")
const { Schema } = mongoose;

const { Product } = require('./product.model');

const cartSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number
});
const CartItem = mongoose.model('CartItem', cartSchema);

module.exports = { CartItem }