const Category = require("../models/Category");

exports.getCategories = async () => {
  try {
    const categories = await Category.find();
    return categories;
  } catch (error) {
    res.send(error.message);
    return [];
  }
};
