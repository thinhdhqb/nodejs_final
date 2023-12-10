var createError = require('http-errors');
var Account = require('../models/account')
var bcrypt = require('bcrypt');


exports.adminAuthenticate = async function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect("/auth/login")
    }
    let userId = req.session.userId;

    let doc = await Account.findById(userId).exec();
    if (doc == null) {
        console.log("2")
        return res.redirect("/auth/login")
    }
    if (doc.role !== "admin") {
        next(createError(401))
        return;
    }
    next();
}