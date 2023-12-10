var express = require('express');
var router = express.Router();
var productController = require('../controllers/admin-product');
const Product = require('../models/product');
form = require('express-form'),
field = form.field;

/* GET product page. */

router.get('/', productController.allProducts)

/* GET add prudct page. */
router.get('/add', function(req, res, next) {
  res.render('admin-product-add', { title: 'Add Product Catalog Management' });
});

router.post('/add' ,form(
  field("name").trim().required("","Vui lòng nhập tên sản phẩm"),
  field("importPrice").trim().required("","Vui lòng nhập giá nhập khẩu"),
  field("retailPrice").trim().required("","Vui lòng nhập giá bán lẻ"),
  field("brand").trim().required("","Vui lòng nhập hãng"),
  field("country").trim().required("","Vui lòng nhập xuất sứ"),
  field("category").trim().required("","Vui lòng nhập loại sản phẩm")
  ), productController.newProduct)
  
router.post('/delete/:id', productController.deleteProduct)

router.get('/edit/:id', async function(req,res,next){
  const product = await Product.findById(req.params.id)
  res.render('admin-product-edit',{product:product})
})

router.post('/edit/:id', form(
  field("name").trim().required("","Vui lòng nhập tên sản phẩm"),
  field("importPrice").trim().required("","Vui lòng nhập giá nhập khẩu"),
  field("retailPrice").trim().required("","Vui lòng nhập giá bán lẻ"),
  field("brand").trim().required("","Vui lòng nhập hãng"),
  field("country").trim().required("","Vui lòng nhập xuất sứ"),
  field("category").trim().required("","Vui lòng nhập loại sản phẩm")
  ), productController.editProduct)

router.get('/search',productController.findProducts)

router.post('/deletes', productController.deleteProducts)
module.exports = router;
