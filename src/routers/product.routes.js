const express = require("express");
const {
  requireSignin,
  adminMiddleware
} = require("../middlewares/common.middleware");
const {
  createProduct,
  getProducts
} = require("../controller/product.controller");
const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

const staticAssets = path.join(__dirname, "../../public");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: (req, file, callback) => {
    callback(null, shortid.generate() + "-" + file.originalname);
  }
});
const multerUploader = multer({ storage });

router.post(
  "/create",
  requireSignin,
  adminMiddleware,
  multerUploader.array("productPicture"),
  createProduct
);

router.post("/getProducts", requireSignin, adminMiddleware, getProducts);

module.exports = router;
