const mongoose = require('mongoose')

const Product = new mongoose.Schema({
    name: {
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
        type: Array,
        default: []
    },
    price: {
        type: number,
        required: true
    },
    sellingPrice: {
        type: number,
        required: true
    },
    sellerId: {
        type: String
    }
}
)

module.exports = mongoose.model('Product', Product)