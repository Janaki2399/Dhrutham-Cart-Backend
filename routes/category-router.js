const express = require("express");
const router = express.Router();
const { Category } = require("../models/category.model");
const { extend } = require("lodash");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const categories = await Category.find({});
      res.status(200).json({ categories, success: true });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "unable to get categories",
        errorMessage: err.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const category = req.body;
      const categoryItem = new Category(category);
      await categoryItem.save();
      res.status(200).json({ category, success: true });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "unable to add category",
        errorMessage: err.message,
      });
    }
  });

router.route("/:categoryId").get(async (req, res) => {
  const categoryId = req.params.categoryId;
  const populatedCategory = await Category.findById(categoryId)
    .lean()
    .populate("products");
  const products = populatedCategory.products;
  res.status(200).json({ products, success: true });
});

module.exports = router;
