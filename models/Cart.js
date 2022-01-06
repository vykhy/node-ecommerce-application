const mongoose = require('mongoose')

const Cart = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: {
        type: [{
            productId: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            addedAt: {
                type: String,
                required: true
            },
            included: {
                type: Boolean,
                required: true,
                default: true
            }
        }],
        default: []
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Cart', Cart)