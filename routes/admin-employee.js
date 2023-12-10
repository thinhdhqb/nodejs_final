var express = require('express');
var router = express.Router();
var form = require('express-form')
var field = form.field
const controller = require('../controllers/admin-employee');


router.get('/',controller.getAllEmployees)
router.post('/unlock',controller.unLockStatus)
router.post('/lock',controller.lockStatus)
router.get('/search',controller.findEmployees)

router.get('/add', controller.getAdd);
router.post('/add', form(
  field("fullName").required("", "Vui lòng nhập họ tên"),
  field("gmail").required("", "Vui lòng nhập tài khoản Gmail").isEmail("Không đúng định dạng Gmail")
),
controller.postAdd);
router.post('/resendActivationMail', form(
  field("username").required("", "Gửi mail thất bại ! Không có tên đăng nhập."),
  field("email").required("", "Gửi mail thất bại ! Không có tài khoản gmail.").isEmail("Gửi mail thất bại ! Không đúng định dạng Gmail.")
),
controller.resendActivationMail);

router.get('/:id',controller.getDetails);

module.exports = router;