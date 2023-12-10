var express = require('express');
var router = express.Router();
var customerController = require('../controllers/staff-customer');
//const Product = require('../models/product');

router.get('/', customerController.allCustomers)
router.get('/search', customerController.findCustomers)
router.get('/:id',customerController.getDetails);
router.post('/detail/order',customerController.getDetailOrder)
module.exports = router;