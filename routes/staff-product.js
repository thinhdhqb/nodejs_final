var express = require('express');
var router = express.Router();
var productController = require('../controllers/staff-product');
//const Product = require('../models/product');

router.get('/', productController.allProducts)
router.get('/search',productController.findProducts)

module.exports = router;