var express = require('express');
var router = express.Router();
var controller = require('../controllers/staff')
var form = require('express-form')
var field = form.field;
var profileRouter = require('./staff-profile')
var cartRouter = require('./staff-cart')
var productRouter = require('./staff-product')
var customerRouter = require('./staff-customer')

router.get('/createPassword', controller.getCreatePassword);
router.post('/createPassword', form(
    field('newPassword').required("", "Vui lòng nhập mật khẩu mới."),
    field('confirmPassword').required("", "Vui lòng nhập xác nhận mật khẩu mới."),
),controller.createPassword);
router.use(controller.staffAuthenticate);

router.get('/', controller.getHome)
router.use('/profile', profileRouter);
router.use('/cart', cartRouter);
router.use('/product',productRouter);
router.use('/customer',customerRouter);

module.exports = router;