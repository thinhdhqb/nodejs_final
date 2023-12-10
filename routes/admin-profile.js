var express = require('express');
var router = express.Router();
var upload = require('../utils/multer');
var form = require('express-form')
var field = form.field
var controller = require('../controllers/admin-profile');

router.get('/', controller.getProfile);
router.post('/changeProfileImage', upload.single('image'), controller.changeProfileImage)
router.post('/changePassword', form(
  field("currentPassword").required("", "Vui lòng nhập đầy đủ thông tin."),
  field("newPassword").required("", "Vui lòng nhập đầy đủ thông tin."),
  field("confirmPassword").required("", "Vui lòng nhập đầy đủ thông tin.")
)
,
controller.changePassword)

module.exports = router;