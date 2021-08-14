const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: { unique: true },
  },
  list: [{ product: { type: Schema.Types.ObjectId, ref: "Product" } }],
});
const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = { Wishlist };
