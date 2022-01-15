const Product = require("../models/Product");

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
    let imageLinks;
    if (product.images.length > 0) {
      imageLinks = product.images.map(
        (image) => `${process.env.BASE_URL}/${image.path}`
      );
    } else imageLinks = [];
    res.render("products/product", { product, details, imageLinks });
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
