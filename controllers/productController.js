const Product = require("../models/Product");
const Category = require("../models/Category");
const upload = require("../services/imageUpload");
const anyIsEmpty = require("../services/functions").anyIsEmpty;

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
    const products = await Product.find();

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
    const products = await Product.find({ category: catId });
    if (products.length < 1) {
      res.send("No product was found");
      return;
    }
    res.render("products/products", { products });
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * return page to choose category when user is about to add a new product
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getChooseCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      res.render("categories/create", {
        message: "No category exists. Create one now.",
      });
      return;
    }
    res.render("products/chooseCat", { categories });
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * returns page with properties of chosen category
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.chooseCategory = async (req, res) => {
  const name = req.body.category;
  try {
    const category = await Category.findOne({ name: name });

    if (!category) {
      res.send("Oops. There was an error.");
      return;
    }
    res.render("products/create", { category });
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * adds a new product
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createProduct = async (req, res) => {
  const { name, description, longDescription, price, sellingPrice, ...data } =
    req.body;
  const catId = req.params.catId;

  try {
    const product = await Product.create({
      name,
      description,
      longDescription,
      price,
      sellingPrice,
      category: catId,
      details: data,
      creator: req.session.uid,
    });
    if (product) {
      res.redirect(`/products/${product._id}`);
      return;
    }
    res.send("Failed to create product");
  } catch (error) {
    res.render("products/create", {
      name,
      description,
      longDescription,
      price,
      sellingPrice,
      error: error.message,
    });
  }
};

/**
 * returns a page to update a product with prefilled form from last save
 * @param {*} req
 * @param {*} res
 */
exports.getUpdateProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findOne({ _id: id });
    if (!product) {
      res.send("Product not found");
    }
    const details = extractProductDetails(product);
    res.render("products/edit", { product, details });
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * handles form submit to update product information
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateProduct = async (req, res) => {
  const id = req.params.id;

  const {
    name,
    description,
    longDescription,
    price,
    sellingPrice,
    ...details
  } = req.body;

  try {
    const product = await Product.findOne({ _id: id });

    //if product doesnt exist. Happens only when page is tampered with.
    if (!product) {
      const product = {
        _id: id,
        name,
        description,
        longDescription,
        price,
        sellingPrice,
      };
      res.render("products/edit", {
        product,
        error: "Failed to update.Dont mess with the URL. It helps no one.",
        details: Object.entries(details),
      });
      return;
    }

    //check if some fields are empty. Arguments take all the variables whose value should be checked for being empty.
    if (anyIsEmpty([name, description, longDescription, price, sellingPrice])) {
      const product = {
        _id: id,
        name,
        description,
        longDescription,
        price,
        sellingPrice,
      };
      res.render("products/edit", {
        product,
        error: "Please fill the required fields",
        details: Object.entries(details),
      });
      return;
    }

    //only products you added can be modified
    if (product.creator != req.session.uid) {
      res.send("Unauthorized. You can only edit products created by you");
      return;
    }

    const success = await product.update({
      name,
      description,
      longDescription,
      price,
      sellingPrice,
      details,
    });
    if (success.acknowledged) {
      res.redirect(`/products/${id}`);
    }
  } catch (error) {
    res.render("errors/error", { error });
  }
};

/**
 * returns 'Delete product' confirm page
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getDeleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    let product = await Product.findOne({ _id: id });
    if (!product) {
      res.send("Product not found");
      return;
    }
    const details = extractProductDetails(product);
    res.render("products/delete", { product, details });
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * handles delete product from database
 * @param {*} req
 * @param {*} res
 */
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const success = await Product.deleteOne({ _id: id });
    if (success.deletedCount > 0) {
      res.send("Deleted successfully");
    }
    res.send("Failed to delete");
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * handles product image upload
 */
exports.setProductImages = async (req, res) => {
  const productId = req.params.productId;

  try {
    upload.multi_upload(5)(req, res, async (err) => {
      if (!res.req.files.length > 0) {
        return res.send("No file found");
      }

      if (err) {
        return res.status(500).send({ error: err.message });
      }
      res.send(
        `<a href=${process.env.SITE_URL}/${res.req.files[0].path}>SEE IMAGE</a>`
      );
    });
  } catch (error) {
    res.send(error.message);
  }
};
