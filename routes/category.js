const router = require("express").Router();
const Category = require("../models/Category");

//get categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length < 1)
      return res.send("No Categories exist at this moment");
    res.render("categories/categories", { categories });
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
