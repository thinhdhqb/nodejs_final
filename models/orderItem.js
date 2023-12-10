const mongoose = require('mongoose')

let orderItemSchema = new mongoose.Schema({
    quantity: Number,
    product: {type: mongoose.SchemaTypes.ObjectId, ref: 'Product'},
    subtotal: Number
})

module.exports = mongoose.model("OrderItem", orderItemSchema);