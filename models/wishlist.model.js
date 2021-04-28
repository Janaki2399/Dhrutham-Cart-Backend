const mongoose = require("mongoose")
const { Schema } = mongoose;

const { Product } = require('./product.model');

const wishlistSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
});
const WishlistItem = mongoose.model('WishlistItem', wishlistSchema);

module.exports = { WishlistItem }