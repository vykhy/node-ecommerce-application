const Cart = require('../models/Cart')

/**
 * fetches items in the cart of a user
 * @param {cart id of user} cartId 
 * @returns array of products in cart
 */
exports.getCartItems = async(cartId) => {
    try{
        let cart = await Cart.findOne({ _id: cartId }).populate('products.productId').populate('userId')
        if(!cart){
            cart = await Cart.create({
                userId: req.session.uid
            })
            const update = await User.findByIdAndUpdate({_id: req.session.uid},{ cart: cart._id})
        }
        return cart._doc
    }
    catch(error){
        return (error)
    }
}