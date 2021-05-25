const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Cart } = require("../models/cart.model");
const { extend } = require("lodash");

router.use(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  // console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.secret);
    console.log(decoded);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized access" });
  }
});
router
  .route("/")
  .get(async (req, res) => {
    try {
      const { userId } = req.user;
      const cart = await Cart.findOne({ userId });

      if (cart) {
        const populatedCart = await cart.populate("products").execPopulate();
        return res.status(200).json({ cart: populatedCart, success: true });
      }

      res.status(204).json({
        success: false,
        errorMessage: "User has no Cart yet",
      });
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const { userId } = req.user;
      // console.log(userId);
      const product = req.body;

      let cart = await Cart.findOne({ userId });

      if (cart) {
        cart = _.extend(cart, {
          products: _.concat(cart.products, product._id),
        });
        const updatedItem = await cart.save();
        const populatedCart = await updatedItem
          .populate("products")
          .execPopulate();
        res.json({ cart: populatedCart, success: true });
      } else {
        const cart = new Cart({
          userId,
          products: [product],
        });
        const savedItem = await cart.save();
        const populatedCart = await savedItem
          .populate("products")
          .execPopulate();
        res.json({ cart: populatedCart, success: true });
      }

      // const isPresent = await WishlistItem.exists({
      //   product: product.product._id,
      // });
      // if (isPresent) {
      //   return res
      //     .status(409)
      //     .json({ success: false, message: "item already exists" });
      // }

      // const wishlistItem = new WishlistItem(product);
      // const insertedItem = await wishlistItem.save();
      // const populatedItem = await insertedItem.populate("product").execPopulate();
    } catch (error) {
      res.status(500).json({
        success: false,
        errorMessage: error.message,
      });
    }
  });

router.delete("/:productId", async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId });
    cart.products.pull({ _id: productId });
    await cart.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
});
// router.route("/:productId").post(async (req, res) => {
//   const { userId } = req.user;
//   const { productId } = req.params;
//   const updateProperty = req.body;
//   let cart = await Cart.findOne({ userId });
//   const updatedCartItem = extend(cart, updateProperty);
//   await updatedCartItem.save();
//   res.status(200).json({ success: true });
//   // try {
//   //   const cartId = req.params.cartId;
//   //   const cartItem = await CartItem.findById(cartId);
//   //   const updateProperty = req.body;
//   //   const updatedCartItem = extend(cartItem, updateProperty);
//   //   const newCartItem = await updatedCartItem.save();
//   //   res.status(200).json({ newCartItem, success: true });
//   // } catch (error) {
//   //   res.status(500).json({ success: false, errorMessage: error.message });
//   // }
// });

module.exports = router;
