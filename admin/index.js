const router = require("express").Router();

const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");

// router.use("/auth", authRouter);
router.get("/", (req, res) => {
  res.render("admin/dashboard");
});
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
// router.use("/order", orderRouter);

module.exports = router;
