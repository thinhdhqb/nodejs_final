const Employee = require("../models/employee");
const Account = require("../models/account");
var createError = require('http-errors');
var bcrypt = require('bcrypt')

exports.getHome = function (req, res) {
    res.render("staff", {title: 'Trang chủ', fullName: req.session.fullName});
}


exports.getCreatePassword = async function (req, res) {
    if (!req.session.loggedIn) {
        return res.redirect("/auth/login")
    }
    let userId = req.session.userId;
    let account = await Account.findById(userId).exec();
    let employee = await Employee.findOne({account: account}).populate('account').exec();
    if (employee.hasChangedPassword)
        return res.redirect("/staff");
    res.render("staff-create-password", {title: 'Tạo mật khẩu'});
}

exports.createPassword = async function (req, res) {
    if (!req.form.isValid) {
        return res.redirect("/staff/createPassword");
    }

    const { newPassword, confirmPassword } = req.body
    if (newPassword !== confirmPassword) {
        req.flash('error', 'Xác nhận mật khẩu không khớp.')
        return res.redirect("/staff/createPassword");
    }

    let userId = req.session.userId;
    let account = await Account.findById(userId).exec();

    let hash = await bcrypt.hash(newPassword, 10);
    account.password = hash;
    await account.save();
    let employee = await Employee.findOne({account : account}).populate('account')
    employee.hasChangedPassword = true;
    await employee.save();
    res.redirect("/staff");
}

exports.staffAuthenticate = async function(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect("/auth/login")
    }
    let userId = req.session.userId;
    let account = await Account.findById(userId).exec();
    if (account == null) {
        return res.redirect("/auth/login")
    }
    if (account.role !== "employee") {
        next(createError(401))
        return;
    }
    let employee = await Employee.findOne({account: account}).populate('account')
    if (!employee.activated) {
        req.flash('error', 'Tài khoản chưa kích hoạt. Vui lòng đăng nhập bằng liên kết từ email.');
        return res.redirect("/auth/login")
    }
    if (employee.locked) {
        req.flash('error', 'Tài khoản đã bị khóa. Vui lòng liên hệ với quản trị viên để mở khóa.');
        return res.redirect("/auth/login")
    }
    if (!employee.hasChangedPassword) {
        return res.redirect("/staff/createPassword")
    }
    next();
}