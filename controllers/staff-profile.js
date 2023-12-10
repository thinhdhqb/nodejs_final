var Account = require('../models/account')
var bcrypt = require('bcrypt');
const Employee = require('../models/employee');

exports.getProfile = async function(req, res) {
    let account = await Account.findById(req.session.userId).exec();
    let employee = await Employee.findOne({account : account}).populate('account').exec();
    account.fullName = employee.fullName;
    res.render('staff-profile', { title: 'Hồ sơ', user: account })
}

exports.changeProfileImage = async function(req, res) {
    let filename = req.file.filename;
    await Account.findByIdAndUpdate(req.session.userId, {profileImg: filename})
    res.redirect('/staff/profile')
}

exports.changePassword = async function(req, res) {
    if (!req.form.isValid)
        return res.redirect("/admin/profile")
    const { currentPassword, newPassword, confirmPassword } = req.body;
    let user = await Account.findById(req.session.userId).exec();
    let result = await bcrypt.compare(currentPassword, user.password);
    if (!result) {
        req.flash('error', 'Mật khẩu hiện tại không đúng.')
        return res.redirect("/staff/profile")
    }

    if (confirmPassword !== newPassword) {
        req.flash('error', 'Xác nhận mật khẩu không đúng.')
        return res.redirect("/staff/profile")
    }

    let hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    req.flash('success', 'Cập nhật mật khẩu thành công')
    return res.redirect("/staff/profile")
}
