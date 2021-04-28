const express = require('express');
require("dotenv").config();
const productRouter=require("./routes/product-router.js");
const categoryRouter=require("./routes/category-router.js");
const cartRouter=require("./routes/cart-router.js");
const wishlistRouter=require("./routes/wishlist-router.js");

const mongoose = require('mongoose');
const {mongoDBConnection}=require("./db/db.connect.js");

const app = express();
var cors = require('cors')
app.use(cors())
var bodyParser = require('body-parser')
app.use(bodyParser.json())

mongoDBConnection();

app.use("/products",productRouter);
app.use("/categories",categoryRouter);
app.use("/cart",cartRouter);
app.use("/wishlist",wishlistRouter);

app.get('/', (req, res) => {
  res.send('Hello janaki')
});


app.use((req,res)=>{
  res.status(400).json({success:false,msg:"no page found"});
})

app.use((err,req,res)=>{
  console.error(err.stack);
  res.status(500).send("something broke");
})

app.listen(8000, () => {
  console.log('server started');
});




