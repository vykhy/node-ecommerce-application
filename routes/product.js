const router = require("express").Router();
const productController = require("../controllers/productController");

//get a product
router.get("/:id", productController.getProduct);

//get all products
router.get("/", productController.getAllProducts);

//get products from a category
router.get("/category/:catId", productController.getCategoryProducts);

module.exports = router;
