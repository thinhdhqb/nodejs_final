var express = require('express');
var router = express.Router();
var form = require('express-form')
var field = form.field
const controller = require('../controllers/admin-reporting-analytics');

router.get('/',controller.getAllOrders)
router.get('/yesterday', controller.getAllOrdersYesterday)
router.get('/sevenDaysAgo',controller.getAllOrdersSevenDaysAgo)
router.get('/thisMonth',controller.getAllOrdersThisMonth)
router.get('/arangeDay',controller.getAllOrdersArangeDay)
router.get('/order/:id',controller.detailOrder)
module.exports = router;