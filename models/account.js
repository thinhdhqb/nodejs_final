const mongoose = require('mongoose')

let accountSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    profileImg: String,
    password: String,
    role: String
})

module.exports = mongoose.model("Account", accountSchema);