const express = require("express");
const router = express.Router();
const { Product } = require('../models/product.model');
const { CartItem } = require('../models/cart.model');
const { WishlistItem } = require('../models/wishlist.model');
const { extend, merge } = require('lodash');

router.route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.find({});
      res.status(200).json({products, success: true })
    }
    catch (err) {
      res.status(500).json({ success: false, message: "unable to get products", errorMessage: err.message })
    }
  })
  .post(async (req, res) => {
    try {
      const product = req.body;
      const productItem = new Product(product);
      await productItem.save();
      res.status(200).json({ product, success: true })
    }
    catch (err) {
      res.status(500).json({
        success: false,
        message: "unable to add product",
        errorMessage: err.message
      })
    }
  })

router.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ success: false, errorMessage: "could not fetch the product" })
    }
    req.product = product;
    next();
  }
  catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message })
  }
})

router.route("/:productId")
  .get(async (req, res) => {
  
    const product=req.product.toObject();

    const wishlistItems=await WishlistItem.find({});
    const cartItems=await CartItem.find({});

 function checkIfItemExistsInList(list, productItem) {
        return list.find((item) =>
         item.product._id.equals(productItem._id)) !== undefined;
      }

      if(checkIfItemExistsInList(cartItems,product)){
        product.isAddedToCart=true;
      }
      else{
        product.isAddedToCart=false;
      }

      if(checkIfItemExistsInList(wishlistItems,product)){
        product.isWishListed=true;
      }
      else{
        product.isWishListed=false;
      }

    product.__v=undefined;
    res.status(200).json({product, success: true });
  })
  .post(async (req, res) => {
    const { product } = req;
    const paramUpdated = req.body;

    const updatedProduct = extend(product, paramUpdated);
    const productNew = await updatedProduct.save();
    res.json({ productNew });
  })

module.exports = router;