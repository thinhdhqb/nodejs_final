var Account = require('../models/account')
var bcrypt = require('bcrypt');

exports.getProfile = async function(req, res) {
    let user = await Account.findById(req.session.userId).exec();
    res.render('admin-profile', { title: 'Profile', user: user })
}

exports.changeProfileImage = async function(req, res) {
    let filename = req.file.filename;
    await Account.findByIdAndUpdate(req.session.userId, {profileImg: filename})
    res.redirect('/admin/profile')
}

exports.changePassword = async function(req, res) {
    if (!req.form.isValid)
        return res.redirect("/admin/profile")
    const { currentPassword, newPassword, confirmPassword } = req.body;
    let user = await Account.findById(req.session.userId).exec();
    let result = await bcrypt.compare(currentPassword, user.password);
    if (!result) {
        req.flash('error', 'Mật khẩu hiện tại không đúng.')
        return res.redirect("/admin/profile")
    }

    if (confirmPassword !== newPassword) {
        req.flash('error', 'Xác nhận mật khẩu không đúng.')
        return res.redirect("/admin/profile")
    }

    let hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    req.flash('success', 'Cập nhật mật khẩu thành công')
    return res.redirect("/admin/profile")
}
