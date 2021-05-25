const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const _ = require("lodash");
const { Wishlist } = require("../models/wishlist.model");

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
      const wishlist = await Wishlist.findOne({ userId });

      if (wishlist) {
        const populatedWishlist = await wishlist
          .populate("list.product")
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
      const product = req.body;

      let wishlist = await Wishlist.findOne({ userId });

      if (wishlist) {
        wishlist.list.push(product);
        const savedItem = await wishlist.save();
        // const wishlistItem = wishlist.list[wishlist.list.length - 1];
        const populatedItem = await savedItem
          .populate("list.product")
          .execPopulate();
        res.json({ wishlst: populatedItem, success: true });
      } else {
        const wishlist = new Wishlist({
          userId,
          list: [product],
        });
        const savedItem = await wishlist.save();
        // const wishlistItemId = wishlist.list[wishlist.list.length - 1]._id;

        // res.json({ wishlistItemId, success: true });
        const populatedWishlist = await savedItem
          .populate("list.product")
          .execPopulate();
        res.json({ wishlist: populatedWishlist, success: true });
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

router.delete("/:wishlistItemId", async (req, res) => {
  try {
    const { userId } = req.user;
    const { wishlistItemId } = req.params;
    let wishlist = await Wishlist.findOne({ userId });
    wishlist.list.pull({ _id: wishlistItemId });
    await wishlist.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
});

module.exports = router;
