const User = require("../models/User");
const bcrypt = require("bcrypt");
const Cart = require("../models/Cart");

/**
 *
 * @param {*} req
 * @param {*} res
 * create new user in database
 * @returns true or false whether signup was successful
 */
exports.userSignUp = async (req, res) => {
  const { name, email, password, confirm } = req.body;

  //check if user with email already exists
  const exists = await User.findOne({ email });

  let error = null;
  if (exists) error = "User with this email already exists";
  //validate form
  else if (name == "" || email == "" || password == "")
    error = "All fields are required";

  //confirm password
  if (password !== confirm) error = "Passwords do not match";

  if (error) {
    res.send("auth/signup", {
      name,
      email,
      password,
      confirm,
      error,
    });
    return false;
  }
  //save to database and return true
  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        throw err;
      } else {
        const user = await User.create({
          name,
          email,
          password: hash,
        });
        if (user) {
          const cart = await Cart.create({ userId: user._id });
        }
        return true;
      }
    });
  } catch (error) {
    res.send(error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*true or false} verified
 * if verified, automatically log in. In this case, it is pre confirmed by the application
 * create sessions
 * @returns boolean whether user login was successful
 */
exports.userLogin = async (req, res, verified) => {
  const { email, password } = req.body;

  if (!verified && (email == "" || password == "")) {
    res.render("auth/login", {
      email,
      password,
      error: "All fields are required",
    });
    return false;
  }

  try {
    const user = await User.findOne({ email: email });

    //Account was just created and is being automatically logged in
    if (verified) {
      session = req.session;
      session.user = user.name;
      session.admin = false;
      return true;
    }
    //Check whether user exists
    if (!user) {
      res.render("auth/login", {
        email,
        password,
        error: "User with this email does not exist",
      });
      return false;
    }

    //Check whether password is correct
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.uid = user._id;
        req.session.user = user.name;
        req.session.admin = false;
        //res.send(result + `${req.session.uid} ${req.session.user}`);
        return true;
      } else if (err) {
        res.render("auth/login", {
          email,
          password,
          error: "Password is wrong",
        });
        return false;
      }
    });
  } catch (error) {
    res.send(error.message);
  }
};
