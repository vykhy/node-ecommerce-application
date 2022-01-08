const router = require('express').Router()
const cartController = require('../controllers/cartController')
const User = require('../models/User')

//view cart
router.get('/', cartController.getUserCart)

//add item to cart
router.post('/add/:productId', cartController.addToCart)

//edit cart
router.post('/checkout', cartController.checkout)

//for testing
router.get('/mycart', async (req, res) => {
    try{
        const cart = await User.find({ _id: req.session.uid})
        console.log(cart)
        res.send(cart)
    }
    catch(error){
        res.send(error)
    }
})

//empty cart
router.post('/empty', cartController.emptyCart)

//remove item from cart
router.get('/remove/:productId', cartController.removeItem)
module.exports = router