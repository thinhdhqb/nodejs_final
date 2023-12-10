const mongoose = require('mongoose')

let orderSchema = new mongoose.Schema({
    customer: {type: mongoose.SchemaTypes.ObjectId, ref: 'Customer'},
    orderItems: [{type: mongoose.SchemaTypes.ObjectId, ref: 'OrderItem'}],
    total: Number,
    amountGiven: Number,
    creationDate: Date,
    createdBy: {type: mongoose.SchemaTypes.ObjectId, ref: 'Employee'},
})
module.exports = mongoose.model("Order", orderSchema);