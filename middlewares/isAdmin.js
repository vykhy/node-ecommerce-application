const isAdmin = (req, res, next) => {
  if (req.session.admin === true) return next();

  res.send("Unauthorized. Only admins can access this page.");
};

module.exports = isAdmin;
