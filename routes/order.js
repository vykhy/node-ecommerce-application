const router = require('express').Router()
const orderController = require('../controllers/orderController')

router.get('/address/:orderId', orderController.getAddAddress)

router.post('/address/:orderId', orderController.addAddress)

module.exports = router