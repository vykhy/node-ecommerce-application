const router = require("express").Router();
const productController = require("../controllers/productController");

//choose category to create product
router.get("/create", productController.getChooseCategory);

//handle choose category
router.post("/create/category", productController.chooseCategory);

//create a product
router.post("/create/:catId", productController.createProduct);

//add product images
router.post("/images/:productId", productController.setProductImages);
router.get("/images", async (req, res) => {
  res.render("products/images");
});

//get a product
router.get("/:id", productController.getProduct);

//get all products
router.get("/", productController.getAllProducts);

//get products from a category
router.get("/category/:catId", productController.getCategoryProducts);

//view to update a product
router.get("/update/:id", productController.getUpdateProduct);

//update a product
router.post("/update/:id", productController.updateProduct);

//view to delete a product
router.get("/delete/:id", productController.getDeleteProduct);

//delete a product
router.post("/delete/:id", productController.deleteProduct);

module.exports = router;
