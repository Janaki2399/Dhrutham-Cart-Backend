const express = require("express");
const router = express.Router();

const { CartItem } = require('../models/cart.model');
const { WishlistItem } = require('../models/wishlist.model');
const { extend } = require('lodash');

router.get("/summary", async (req, res) => {
  const cart = await CartItem.find({});
  res.status(200).json({ cartLength: cart.length })
})

router.route("/")
  .get(async (req, res) => {
    try {
      const cart = await CartItem.find({}).populate("product");
      res.status(200).json({ cart, success: true })
    }
    catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  })
  .post(async (req, res) => {
    try {
      const product = req.body;
      const isPresent = await CartItem.exists({ product: product.product._id });
      if (isPresent) {
        return res.status(409).json({ success: false, message: "item already exists" });
      }
      const cartItem = new CartItem(product);
      await cartItem.save();
      res.json({ cartItem, success: true })
    }
    catch (error) {
      res.status(500).json({
        success: false,
        errorMessage: err.message
      })
    }
  })

router.param("cartId", async (req, res, next, cartId) => {
  try {
    const cartItem = await CartItem.findById(cartId);
    if (!cartItem) {
      return res.status(400).json({ success: false, errorMessage: "could not fetch the cartItem" })
    }
    req.cartItem = cartItem;
    next();
  }
  catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message })
  }
})

router.route("/:cartId")
  .post(async (req, res) => {
    try {
      const { cartItem } = req;
      const updateProperty = req.body;
      const updatedCartItem = extend(cartItem, updateProperty);
      const newCartItem = await updatedCartItem.save();
      res.status(200).json({ newCartItem, success: true });
    }
    catch (error) {
      res.status(500).json({ success: false, errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    try{
      const { cartItem } = req;
      await cartItem.remove();
      res.status(200).json({ cartItem, success: true });
    }
    catch(error){
      res.status(500).json({ success: false, errorMessage: error.message })
    }
  })

module.exports = router; 