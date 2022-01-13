const Cart = require("../models/Cart");
const User = require("../models/User");

/**
 * fetches items in the cart of a user
 * @param {cart id of user} cartId
 * @returns array of products in cart
 */
exports.getCartItems = async (req) => {
  //   const uid = ;
  try {
    let cart = await Cart.findOne({ userId: req.session.uid })
      .populate("products.productId")
      .populate("userId");
    if (!cart) {
      const user = await User.findOne({ name: req.session.uid });
      cart = await Cart.create({ userId: user._id });
    }
    return cart;
  } catch (error) {
    return error;
  }
};
