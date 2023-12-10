var express = require("express");
var router = express.Router();
var controller = require("../controllers/staff-cart");
var form = require("express-form");
var field = form.field;

router.get("/", controller.getCart);
router.post(
    "/",
    form(field("barcode").array(), field("quantity").array().toInt()),
    controller.postCart
);
router.get("/checkout", controller.getCheckout);
router.get(
    "/checkout/getCustomerByPhoneNumber",
    controller.getCustomerByPhoneNumber
);
router.post(
    "/checkout",
    form(
        field("phone")
            .trim()
            .required("", "Vui lòng nhập đầy đủ thông tin.")
            .isNumeric("Số điện thoại phải là không được chứa kí tự chữ cái.")
            .minLength(10, "Số điện thoại phải có đủ 10 kí tự")
            .maxLength(10, "Số điện thoại phải có đủ 10 kí tự"),
        field("fullName")
            .trim()
            .required("", "Vui lòng nhập đầy đủ thông tin."),
        field("numberStreet")
            .trim(),
        field("city").trim(),
        field("district").trim(),
        field("ward").trim(),
        field("amountGiven").toInt()
    ),
    controller.postCheckout
);


router.get('/', controller.getCart);
router.post('/', form(
    field('barcode').array(),
    field('quantity').array().toInt()
) ,controller.postCart);
router.get('/checkout', controller.getCheckout);    
router.post('/checkout', controller.postCheckout);

router.get('/invoice/:id', controller.getInvoice);    

router.post('/search', controller.searchProduct);
router.post('/searchBC',controller.searchProductByBarCode);

module.exports = router;
