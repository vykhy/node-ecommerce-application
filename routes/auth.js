const router = require("express").Router();
const authController = require("../controllers/authController");

//return page with signup form
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

/**
 * process signup request
 */
router.post("/signup", async (req, res) => {
  //add user in database
  let success = await authController.userSignUp(req, res);
  // if added successfully, automatically log in user and redirect
  // errors are handled and responded internall in controller
  if (success) {
    let success = await authController.userLogin(req, res, true);
    if (success) res.redirect("/");
  }
});

/**
 * return page with login form
 */
router.get("/login", (req, res) => {
  res.render("auth/login");
});
/**
 * process login request
 * main function handled in controller
 */
router.post("/login", async (req, res) => {
  let success = await authController.userLogin(req, res, false);
  if (success) res.redirect("/");
});

/**
 * logout request, destroy sessions
 */
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
