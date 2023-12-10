const mongoose = require('mongoose')

let employeeSchema = new mongoose.Schema({
    fullName: String,
    locked: Boolean,
    activated: Boolean,
    account: {type: mongoose.SchemaTypes.ObjectId, ref: 'Account'},
    orders: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Order'}],
    hasChangedPassword: {type: Boolean, default: false},
})

module.exports = mongoose.model("Employee", employeeSchema);