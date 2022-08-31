const router = require("express").Router();

//view orders of current user
router.get("/success", (req, res) => {
  return res.render("checkout/success");
});

router.get("/cancel", (req, res) => {
  return res.render("checkout/cancel");
});

module.exports = router;
