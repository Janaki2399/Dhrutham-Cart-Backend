const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Cart } = require("../models/cart.model");
const { _, extend } = require("lodash");

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
        const isPresent = _.some(cart.list, (item) => {
          return item.product.toString() === product.product._id;
        });
  
        if (isPresent) {
        return res
          .status(409)
          .json({ success: false, message: "item already exists" });
        }

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
    cart = _.extend(cart, {
      list: _.filter(cart.list, (item) => {
        return item.product.toString() !== productId;
      }),
    });
    await cart.save();

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
});
router.route("/:productId").post(async (req, res) => {
  try{
  const { userId } = req.user;
  const { productId } = req.params;
  const updateProperty = req.body;

  let cart = await Cart.findOne({ userId });

  const updatedCartItem = _.extend(cart, {
    list: _.map(cart.list, (item) => {
      if (item.product.toString() === productId) {
        return extend(item, updateProperty);
      } else {
        return item;
      }
    }),
  });

  await updatedCartItem.save();
  res.status(200).json({ success: true });
  }
  catch(error){
  res.status(500).json({ success: false, errorMessage: error.message });
  }
});

module.exports = router;
