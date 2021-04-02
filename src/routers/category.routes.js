const express = require("express");
const {
  requireSignin,
  adminMiddleware,
  userMiddleware
} = require("../middlewares/common.middleware");
const router = express.Router();
const {
  addCategory,
  getCategories
} = require("../controller/category.controller");

router.post("/create", requireSignin, adminMiddleware, addCategory);

router.get("/getCategory", requireSignin, getCategories);
module.exports = router;
