const mongoose = require('mongoose')

const Address = new mongoose.Schema({
    country: { 
        type: String , 
        required },
    province: { 
        type: String ,
        required 
    },
    city: { 
        type: String 
    },
    street1: { 
        type: String, 
        required 
    },
    street2: { 
        type: String 
    },
    zip_code: { 
        type: String, 
        required 
    }
},{
    timestamps: true
})

module.exports = mongoose.Model('Address', Address)