const mongoose = require('mongoose')

let productSchema = new mongoose.Schema({
    barcode: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    importPrice: {type: Number, required: true},
    retailPrice: {type: Number, required: true},
    category: {type: String, required: true},
    brand: {type: String, required: true},
    country: {type: String, required: true},
    creationDate: {type: Date, required: true},
})

module.exports = mongoose.model("Product", productSchema);