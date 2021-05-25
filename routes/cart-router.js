const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Cart } = require("../models/cart.model");
const _ = require("lodash");

router.use(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.secret);
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
        const populatedCart = await cart
          .populate("list.product")
          .execPopulate();
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
      const product = req.body;

      let cart = await Cart.findOne({ userId });

      if (cart) {
        // cart = _.extend(cart, {
        //   products: _.concat(cart.products, product),
        // });
        cart.list.push(product);
        const savedItem = await cart.save();
        const populatedCart = await savedItem
          .populate("list.product")
          .execPopulate();
        res.json({ cart: populatedCart, success: true });
      } else {
        const cart = new Cart({
          userId,
          list: [product],
        });
        const savedItem = await cart.save();
        const populatedCart = await savedItem
          .populate("list.product")
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

router.delete("/:cartItemId", async (req, res) => {
  try {
    const { userId } = req.user;
    const { cartItemId } = req.params;
    let cart = await Cart.findOne({ userId });
    cart.list.pull({ _id: cartItemId });
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
