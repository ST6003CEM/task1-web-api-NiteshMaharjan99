const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minLength: 6,
        unique: true, 
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        required: true
    },
    password:{ 
        type: String,
        required: true,
    },
    fullname:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
})

module.exports = new mongoose.model('User', userSchema)