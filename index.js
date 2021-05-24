const express = require("express");
require("dotenv").config();
const productRouter = require("./routes/product-router.js");
const categoryRouter = require("./routes/category-router.js");
const cartRouter = require("./routes/cart-router.js");
const wishlistRouter = require("./routes/wishlist-router.js");
const userRouter = require("./routes/user-router.js");

const mongoose = require("mongoose");
const { mongoDBConnection } = require("./db/db.connect.js");
const PORT = process.env.PORT || 5000;
const app = express();
var cors = require("cors");
app.use(cors());

app.use(express.json());

mongoDBConnection();

app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello janaki");
});

/**
 * 404 Route Handler
 * Note: DO not MOVE. This should be the last route
 */
app.use((req, res) => {
  res.status(404).json({ success: false, msg: "Route not found" });
});

/**
 * Error Handler
 * Don't move
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, errorMessage: err.message });
});

app.listen(PORT, () => {
  console.log("server started");
});
