var express = require('express');
var router = express.Router();
var adminRouter = require('./admin');
var authRouter = require('./auth');
var staffRouter = require('./staff');


router.use('/admin', adminRouter);
router.use('/staff', staffRouter);
router.use('/auth', authRouter);
// router.use('/order', orderRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.role === "admin")
    return res.redirect('/admin');
  else res.redirect('/staff');
});



module.exports = router;
