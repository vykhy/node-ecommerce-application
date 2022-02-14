const Cart = require("../models/Cart");
const checkOutService = require("../services/checkout");
const cartService = require("../services/cart");
const Order = require("../models/Order");

exports.getUserCart = async (req, res) => {
  try {
    const cart = await cartService.getCartItems(req);
    // return res.send(`<pre>${cart}</pre>`);
    res.render("carts/cart", { cart });
  } catch (error) {
    res.render("errors/error", { error });
  }
};

exports.addToCart = async (req, res) => {
  const productId = req.params.productId;
  const quantity = req.body.quantity || 1;

  if (quantity < 0) {
    res.send("Hey smartass.  Quantity can't be negatve");
  }

  try {
    //get cart of current user
    const cart = await Cart.findOne({
      userId: req.session.uid,
    });

    //if any productId in array of products in cart matches this product id
    //inform user that it is already in cart
    if (cart.products.some((product) => product.productId == productId)) {
      res.send("Item is already in cart!");
      return;
    }

    //add product to cart and save
    cart.products.push({
      productId,
      quantity,
      addedAt: new Date(Date.now()),
    });

    const success = await cart.save();
    if (success) {
      res.send(`Added ${quantity} nos of this product to cart`);
      return;
    }
    res.send("Failed to add to cart");
  } catch (error) {
    res.render("errors/error", { error });
  }
};

exports.checkout = async (req, res) => {
  const { ...data } = req.body;

  if (!Object.keys(data).length > 0) {
    res.render("carts/cart", { message: "No item in cart!" });
    return;
  }

  const finalProducts = await checkOutService.filterProductsAndCalculatePrice(
    req,
    data
  );

  if (finalProducts.length <= 0) {
    res.send("No item selected for checkout!");
    return;
  }

  const { total, sellingTotal, saved } =
    checkOutService.calculateTotals(finalProducts);

  let order;

  try {
    const exists = await Order.findOne({
      customer: req.session.uid,
      products: finalProducts,
      status: "initiated",
    });
    if (!exists) {
      order = await Order.create({
        customer: req.session.uid,
        products: finalProducts,
        total: sellingTotal,
        status: "initiated",
      });
    } else {
      order = exists;
    }
  } catch (error) {
    res.send(error.message);
  }

  if (!order) {
    return res.send("Failed to initiate order");
  }
  return res.render("checkout/summary", {
    products: Object.values(finalProducts),
    total,
    sellingTotal,
    saved,
    status: order.status,
    order: order._id,
  });
};

exports.removeItem = async (req, res) => {
  const productId = req.params.productId;
  try {
    const cart = await Cart.findOneAndUpdate(
      {
        userId: req.session.uid,
      },
      {
        $pull: { products: { productId: { _id: productId } } },
      }
    );
    res.send("Item removed from cart");
  } catch (error) {
    res.send(error.message);
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const success = await Cart.findOneAndUpdate(
      { userId: req.session.uid },
      { products: [] }
    );
    if (success.products.length === 0) {
      res.render("carts/cart", { message: "Deleted all items in cart" });
      return;
    }
    res.render("carts/cart", { error: "Failed to empty cart" });
  } catch (error) {
    res.render("errors/error", { error });
  }
};
