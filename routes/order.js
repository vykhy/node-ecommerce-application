const router = require("express").Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.getOrders);

router.get("/delete/:orderId", orderController.getDeleteOrder);

router.post("/delete/:orderId", orderController.deleteOrder);

router.get("/address/:orderId", orderController.getAddAddress);

router.post("/address/:orderId", orderController.addAddress);

module.exports = router;
