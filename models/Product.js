const mongoose = require('mongoose')

const Product = new mongoose.Schema({
    _id: {
        type: String,
        min: 4,
        max: 30,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
    },
    category: {
        type: String,
        required: false
    },
    details: {
        type: Object,
        default: {}
    },
    price: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    sellerId: {
        type: String
    },
    creator: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
}
)

module.exports = mongoose.model('Product', Product)