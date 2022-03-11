const router = require("express").Router();
const Order = require("../models/Order");
const orderController = require("../controllers/orderController");

//view orders of current user
router.get("/", orderController.getOrders);

router.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.send(`<pre>${orders}</pre>`);
});

//view a single order
router.get("/:orderId", orderController.getOrder);

//confirm page to delete an order
router.get("/delete/:orderId", orderController.getDeleteOrder);

//delete order from database
router.post("/delete/:orderId", orderController.deleteOrder);

//return page to set order address
router.get("/address/:orderId", orderController.getAddAddress);

//add address to order
router.post("/address/:orderId", orderController.addAddress);

module.exports = router;
