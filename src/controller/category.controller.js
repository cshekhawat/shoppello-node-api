const Category = require("../models/category.model");
const slugify = require("slugify");
const shortid = require("shortid");

exports.addCategory = (req, res) => {
  const {
    body: { name, parentId },
    user: { _id }
  } = req;
  const categoryObj = {
    name,
    slug: `${slugify(name)}-${shortid.generate()}}`,
    createdBy: _id
  };
  if (parentId) {
    categoryObj.parentId = parentId;
  }
  const category = new Category(categoryObj);
  category
    .save()
    .then(data => {
      if (data) {
        res.status(201).json({
          data,
          status: "S",
          message: "Category created successfully"
        });
      }
    })
    .catch(error => {
      return res
        .status(400)
        .json({ error, status: "E", message: "Error while creating category" });
    });
};

exports.getCategories = (req, res) => {
  Category.find({})
    .exec()
    .then(categories => {
      const categoryList = createCategories(categories);
      res.status(200).json({ data: categoryList, status: "S" });
    })
    .catch(error => {
      return res.status(400).json({
        error,
        status: "E",
        message: "Error while fetching categories"
      });
    });
};

const createCategories = (categories, parentId = null) => {
  const categoryList = [];
  if (parentId == null) {
    filteredCategories = categories.filter(c => c.parentId == undefined);
  } else {
    filteredCategories = categories.filter(c => c.parentId == parentId);
  }

  filteredCategories.forEach(f => {
    categoryList.push({
      _id: f._id,
      name: f.name,
      slug: f.slug,
      parentId: f.parentId,
      type: f.type,
      children: createCategories(categories, f._id)
    });
  });
  return categoryList;
};
