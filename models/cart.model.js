const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: { unique: true },
  },
  products: [{ type: Schema.Types.ObjectId, ref: "Product", quantity: Number }],
});
const Cart = mongoose.model("Cart", cartSchema);

module.exports = { Cart };
