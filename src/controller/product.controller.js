const Product = require("../models/product.model");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category.model");

exports.createProduct = (req, res) => {
  console.log(req);
  const {
    body: { name, price, description, category, quantity, createdBy },
    user: { _id: userId }
  } = req;
  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map(file => {
      return { img: file.filename };
    });
  }

  const product = new Product({
    name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures,
    category,
    createdBy: userId
  });

  product
    .save()
    .then(response => {
      if (response) {
        res.status(201).json({
          data: response,
          status: "S",
          message: "Product created successfully"
        });
      }
    })
    .catch(error => {
      return res
        .status(400)
        .json({ error, status: "E", message: "Error while creating product" });
    });
};

exports.getProducts = async (req, res) => {
  const {
    user: { _id: userId }
  } = req;
  try {
    const products = await Product.find({ createdBy: userId })
      .select(
        "_id name price quantity slug description productPictures category"
      )
      .populate({ path: "category", select: "_id name" }.exec());
    res.status(200).json({
      products,
      status: "S",
      message: "Products fetched successfully"
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error, status: "E", message: "Error while fetching products" });
  }
};
