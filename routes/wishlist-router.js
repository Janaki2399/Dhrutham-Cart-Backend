const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const _ = require("lodash");
const { WishlistItem } = require("../models/wishlist.model");

router.use(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.secret);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.json({ success: false, errorMessage: "Unauthorized access" });
  }
});
router
  .route("/")
  .get(async (req, res) => {
    try {
      const { userId } = req.user;
      const wishlist = await WishlistItem.findOne({ userId });

      if (wishlist) {
        const populatedWishlist = await wishlist
          .populate("products")
          .execPopulate();
        return res
          .status(200)
          .json({ wishlist: populatedWishlist, success: true });
      }

      res.status(204).json({
        success: false,
        errorMessage: "User has no wishlist yet",
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

      let wishlist = await WishlistItem.findOne({ userId });

      if (wishlist) {
        wishlist = _.extend(wishlist, {
          products: _.concat(wishlist.products, product._id),
        });
        const updatedItem = await wishlist.save();
        const populatedWishlist = await updatedItem
          .populate("products")
          .execPopulate();
        res.json({ wishlistItem: populatedWishlist, success: true });
      } else {
        const wishlistItem = new WishlistItem({
          userId,
          products: [product],
        });
        const savedItem = await wishlistItem.save();
        const populatedWishlist = await savedItem
          .populate("products")
          .execPopulate();
        res.json({ wishlistItem: populatedWishlist, success: true });
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
    let wishlist = await WishlistItem.findOne({ userId });
    wishlist.products.pull({ _id: productId });
    const updated = await wishlist.save();
    await updated.populate("products").execPopulate();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
});

module.exports = router;
