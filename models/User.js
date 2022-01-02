const mongoose = require('mongoose')

const User = new mongoose.Schema({
    name: {
        type: String,
        min: 4,
        max: 30,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false,
        required: false
    }
}
)

module.exports = mongoose.model('User', User)