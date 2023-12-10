var Account = require("../models/account");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Employee = require("../models/employee");

exports.getLogin = async function (req, res) {
    const token = req.query.token;
    if (!token)
        req.flash("error", "Bạn chỉ có thể đăng nhập khi đã kích hoạt tài khoản. Nếu là người mới, vui lòng đăng nhập bằng liên kết từ email.");
    res.render("login", { title: "Login" });
};

exports.postLogin = async function (req, res) {
    if (!req.form.isValid) {
        return res.redirect("/auth/login");
    }

    const { username, password } = req.body;
    if (username !== 'admin') {
        await loginAsStaff(req, res);
    }
    else {
        await loginAsAdmin(req, res);
    }
};

exports.logout = async function (req, res) {
    req.session.destroy();
    res.redirect("/auth/login");
};

async function loginAsStaff(req, res) {
    const { username, password } = req.body;
    const token = req.query.token;
    if (token) { 
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch {
            req.flash("error", "Token không hợp lệ");
            return res.redirect("/auth/login");
        }
        if (
            !decoded.hasOwnProperty("username") ||
            !decoded.hasOwnProperty("expirationDate")
        ) {
            req.flash("error", "Token không hợp lệ");
            return res.redirect("/auth/login");
        }
        let tokenUsername = decoded.username;
        let expirationDate = Date.parse(decoded.expirationDate);
        if (expirationDate < new Date().getTime()) {
            req.flash("error", 
                "Token đã hết hạn. Vui lòng liên hệ với quản trị viên để gửi lại liên kết đăng nhập."
            );
            return res.redirect("/auth/login");
        }
        if (username !== tokenUsername) {
            req.flash("error", 
                "Tên đăng nhập không hợp lệ"
            );
            return res.redirect("/auth/login");
        }
    }
    // after token validated / no token

    let account = await Account.findOne({username: username}).exec();
    if (account == null) {
        req.flash("error", "Tài khoản không tồn tại");
        return res.redirect("/auth/login");
    }
    let user = await Employee.findOne({account: account}).populate('account').exec();

    if (!token && !user.activated) { // trying to login without token and validated
        req.flash("error", "Tài khoản chưa xác thực. Vui lòng đăng nhập bằng liên kết từ email");
        return res.redirect("/auth/login");
    }
    bcrypt.compare(password, user.account.password, async function (err, result) {
        if (result == true) {
            req.session.userId = user.account._id;
            req.session.loggedIn = true;
            req.session.role = "employee";
            if (token) { // activate user
                user.activated = true;
                await user.save();
            }
            req.session.fullName = user.fullName;
            res.redirect("/staff");
        } else {
            req.flash("error", "Mật khẩu không đúng.");
            res.redirect("/auth/login");
        }
    });
} 

async function loginAsAdmin(req, res) {
    const { username, password } = req.body;
    let doc = await Account.findOne({ username: 'admin' }).exec();
    if (doc === null) {
        req.flash("error", "Tên đăng nhập không tồn tại.");
        return res.redirect("/auth/login");
    }

    bcrypt.compare(password, doc.password, function (err, result) {
        if (result == true) {
            req.session.userId = doc._id;
            req.session.loggedIn = true;
            req.session.role = "admin";
            res.redirect("/admin");
        } else {
            req.flash("error", "Mật khẩu không đúng.");
            res.redirect("/auth/login");
        }
    });
}
