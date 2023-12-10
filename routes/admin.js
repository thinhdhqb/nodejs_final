var express = require('express');
var router = express.Router();
var controller = require('../controllers/admin')
var upload = require('../utils/multer');
var form = require('express-form')
var field = form.field
var employeeRouter = require('./admin-employee');
var profileRouter = require('./admin-profile');
var productRouter = require('./admin-product');
var reportingRouter = require('./admin-reporting-analytics');

router.use(controller.adminAuthenticate);

router.get('/', function(req, res, next) {
  res.redirect('/admin/reporting');
});
router.use('/profile', profileRouter);
router.use('/product', productRouter)
router.use('/employee', employeeRouter)
router.use('/reporting',reportingRouter)

module.exports = router;
