const Product = require("../models/Product");
const { formatImagePath } = require("../services/functions");

function extractProductDetails(product) {
  return Object.entries(product.details);
}

/**
 * get a product by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);

    if (!product) {
      res.send("Oops. Product was not found");
      return;
    }
    const details = extractProductDetails(product);
    formatImagePath(product);
    //return res.send(`<pre>${imageLinks}</pre>`);
    res.render("products/product", { product, details });
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * get all products in database
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ available: true });
    products.forEach((product) => {
      formatImagePath(product);
    });
    if (!products) {
      res.send("No product was found");
      return;
    }
    res.render("products/products", { products });
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * get all products in a category by category id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getCategoryProducts = async (req, res) => {
  const catId = req.params.catId;

  try {
    const products = await Product.find({ category: catId, available: true });
    if (products.length < 1) {
      res.send("No product was found");
      return;
    }
    res.render("products/products", { products });
  } catch (error) {
    res.send(error.message);
  }
};
