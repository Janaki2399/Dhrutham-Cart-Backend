const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: { unique: true },
  },
  list: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
const Cart = mongoose.model("Cart", cartSchema);

module.exports = { Cart };
