const express = require("express");
const {
  addItemToCart,

  getCartItems
} = require("../controller/cart.controller");
const {
  requireSignin,
  userMiddleware
} = require("../middlewares/common.middleware");
const router = express.Router();

router.post("/addtocart", requireSignin, userMiddleware, addItemToCart);

router.post("/getCartItems", requireSignin, userMiddleware, getCartItems);

module.exports = router;
