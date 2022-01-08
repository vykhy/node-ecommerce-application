const Order = require('../models/Order')
const anyIsEmpty = require('../services/functions').anyIsEmpty

exports.getAddAddress = async ( req, res ) => {
    const orderId = req.params.orderId 
    if(anyIsEmpty([orderId])) return res.send('Order not found')
    res.render('checkout/address', { orderId })
}

exports.addAddress = async ( req, res ) => {
    const orderId = req.params.orderId

    const { country, province, city, street1, street2, zip } = req.body

    if(anyIsEmpty([country, province, street1, zip])){
        res.send('checkout/address', { country, province, city, street1, street2, zip, error: 'Fill in all required fields'})
        return
    }

    try{
        let order = await Order.findOne({ _id: orderId, userId: req.session.uid })
        if(!order){
            res.send('checkout/address', { country, province, city, street1, street2, zip, error: 'Order not found. please try again'})
            return
        }
        order.address = {
            country, province, city, street1, street2, zip
        }
        order.status = 'pending'
        order = await order.save()
        return res.render('checkout/billing', { order: order._id })
    }
    catch(error){
        res.send(error.message)
    }

}