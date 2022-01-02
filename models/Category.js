const mongoose = require('mongoose')

const Category = new mongoose.Schema({
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
    attributes: {
        type: Array,
        default: []
    },
}
)

module.exports = mongoose.model('Category', Category)