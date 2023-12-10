var express = require('express');
var router = express.Router();
var controller = require('../controllers/auth')
var form = require('express-form')
var field = form.field;


router.get('/login', controller.getLogin);
router.post('/login', form(
    field("username").required("", "Vui lòng nhập tên đăng nhập"),
    field("password").required("", "Vui lòng nhập mật khẩu"),
), controller.postLogin);

router.post('/logout', controller.logout)

module.exports = router;
