const isAuth = (req, res, next) => {
  if (req.session.uid) return next();

  res.render("auth/login", {
    message: "Please log in to perform this action.",
  });
};

module.exports = isAuth;
