const mongoose = require('mongoose')

let customerSchema = new mongoose.Schema({
    phoneNumber: {type: String, unique: true, required: true},
    fullName: String,
    address: String
})

module.exports = mongoose.model("Customer", customerSchema);