const express = require("express");
const router = express.Router();
const { WishlistItem } = require('../models/wishlist.model');

router.get("/summary",async (req,res)=>{
  const wishlist=await WishlistItem.find({});
   res.status(200).json({wishlistLength:wishlist.length})
})

router.route("/")
  .get(async (req, res) => {
    try {
      const wishlist = await WishlistItem.find({}).populate("product");
      res.status(200).json({ wishlist, success: true })
    }
    catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  })
  .post(async (req, res) => {
    try {
      const product = req.body;

      const isPresent=await WishlistItem.exists({product:product.product._id});
      if(isPresent){
        return res.status(409).json({success:false,message:"item already exists"});
      }

      const wishlistItem = new WishlistItem(product);
      await wishlistItem.save();
      res.json({ wishlistItem, success: true })
    }
    catch (error) {
      res.status(500).json({
        success: false,
        errorMessage: err.message
      })
    }
  })

router.route("/:productId")
  .delete(async (req, res) => {
    try{
      const productId=req.params.productId;
      await WishlistItem.findOneAndDelete({product:productId});
      res.json({ success: true });
    }catch(error){
      res.status(500).json({ success: false, errorMessage: err.message });
    }
  })


module.exports = router