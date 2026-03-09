const mongoose = require('mongoose')
require('dotenv').config()
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: "customer"
    }
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel