const Order = require("../models/Order");
const anyIsEmpty = require("../services/functions").anyIsEmpty;
const stripe = require("stripe")(process.env.STRIPE_KEY);

/**
 * This function fetches and renders all the orders of the current user
 * @param {*} req
 * @param {*} res
 */
exports.getOrders = async (req, res) => {
  let message;
  const userId = req.session.uid;
  try {
    const orders = await Order.find({
      customer: { _id: userId },
      deleted: false,
    });
    if (orders.length < 1) {
      message = "You do not have any orders";
    }
    res.render("orders/orders", { orders: Object.values(orders), message });
  } catch (error) {
    res.send(error.message);
  }
};

exports.getOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findOne({
      _id: orderId,
      customer: req.session.uid,
    }).populate("customer");
    if (!order) {
      return res.send("There was an error. Order not found.");
    }
    //console.log(order);
    return res.render("orders/order", { order });
  } catch (error) {
    res.send(error.message);
  }
};
exports.getDeleteOrder = async (req, res) => {
  res.render("orders/delete", { orderId: req.params.orderId });
};

/**
 * This function deletes an order after verifying that it is owned by the current user.
 * Completed orders are preserved so that sales data is retained, but they will be marked as deleted
 * and not be visible to the user
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    let order = await Order.findOne({
      customer: req.session.uid,
      _id: orderId,
    });
    if (!order) {
      res.send("There was an error");
      return;
    }
    if (order.status !== "completed") {
      success = await Order.findOneAndDelete({
        customer: req.session.uid,
        _id: orderId,
      });
      if (success) {
        return res.send("Your order has been deleted");
      }
    }
    order.deleted = true;
    order = await order.save();

    res.send("Your order has been removed");
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * This function renders a page with a form to add address to the current order
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAddAddress = async (req, res) => {
  const orderId = req.params.orderId;
  if (anyIsEmpty([orderId])) return res.send("Order not found");
  res.render("checkout/address", { orderId });
};

/**
 * This function gets address details from form data and adds it to an order in the database
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addAddress = async (req, res) => {
  const orderId = req.params.orderId;

  const { country, province, city, street1, street2, zip } = req.body;

  if (anyIsEmpty([country, province, street1, zip])) {
    res.send("checkout/address", {
      country,
      province,
      city,
      street1,
      street2,
      zip,
      error: "Fill in all required fields",
    });
    return;
  }

  try {
    let order = await Order.findOne({ _id: orderId, userId: req.session.uid });
    if (!order) {
      res.send("checkout/address", {
        country,
        province,
        city,
        street1,
        street2,
        zip,
        error: "Order not found. please try again",
      });
      return;
    }
    order.address = {
      country,
      province,
      city,
      street1,
      street2,
      zip,
    };
    order.stage = "address";
    order.status = "pending";
    order = await Order.findOneAndUpdate(
      { _id: orderId, userId: req.session.uid },
      order
    );
    return res.redirect(`checkout/billing/${orderId}`);
  } catch (error) {
    res.send(error.message);
  }
};

exports.getBillingPage = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findOne({ _id: orderId });
    return res.render("checkout/billing", { amount: order.total, orderId });
  } catch (error) {
    return res.send("There was an error. Please try again");
  }
};

exports.processPayment = async (req, res) => {
  const orderId = req.params.orderId;
  const SUCCESS_URL = `${process.env.SITE_URL}/checkout/success`;
  //get the order
  let order;
  try {
    order = await Order.findOne({
      _id: orderId,
      status: "pending",
      stage: "address",
    });
  } catch (error) {
    return res.render("errors/error", {
      error: { message: "There was an error" },
    });
  }
  //console.log(order.products);
  try {
    // call stripe api
    const session = await stripe.checkout.sessions.create({
      line_items: order.products.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: item.sellingPrice * 100, // rupees to paise
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: SUCCESS_URL,
      cancel_url: `${process.env.SITE_URL}/checkout/cancel`,
    });

    // if payment successful, update order data in database
    // handleWhenPaymentSucceededOrFailed()

    // for now mark as complete
    try {
      const order = await Order.findOneAndUpdate(
        { _id: orderId },
        {
          stage: "paid",
          status: "completed",
        }
      );
    } catch (error) {
      console.log(error);
    }

    res.redirect(303, session.url);
  } catch (error) {
    console.log(error);
    return res.render("errors/error", {
      error: { message: "There was an error" },
    });
  }
};

function handleWhenPaymentSucceededOrFailed() {
  const sig = request.headers["stripe-signature"];
  const body = request.body;

  let event = null;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    // invalid signature
    response.status(400).end();
    return;
  }

  let intent = null;
  switch (event["type"]) {
    case "payment_intent.succeeded":
      intent = event.data.object;
      console.log("Succeeded:", intent.id);
      break;
    case "payment_intent.payment_failed":
      intent = event.data.object;
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.log("Failed:", intent.id, message);
      break;
  }
}
