var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var config = require('./configs/config')
var exphbs = require('express-handlebars');
const moment = require('moment');

var flash = require('express-flash')
var session = require('express-session')
var indexRouter = require('./routes/index');

mongoose.connect(config.mongo_db);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('node js final'));
app.use(session({
  secret: 'node js final',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000000000000000 }
}))
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

//helper
const hbs = exphbs.create({
  extname: '.hbs',
  helpers: {
    formatCurrencyVND: function (value) {
      const formattedCurrency = value.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
      return formattedCurrency;
    },
    increment: function (value) {
      return value + 1;
    },
    eq: function (a, b) {
      return a === b;
    },
    formatDate: function (date) {
      const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
      return new Date(date).toLocaleDateString('vi-VN', options);
    },
    range: function(start, end){
      const result = [];
      for (let i = start; i <= end; i++) {
          result.push(i);
      }
      return result;
    },
    gt: function(a,b){
      return a > b;
    },
    mul: function(a,b){
      return a*b;
    },
    add: function(a,b){
      return a+b;
    },
    min: function(a,b){
      return a-b;
    },
    formatDateAndTime(mongooseDate) {
      return moment(mongooseDate).format('HH:mm DD-MM-YYYY');
    }
  },
  defaultLayout: 'layout',
  runtimeOptions:{allowProtoPropertiesByDefault:true,
    allowedProtoMethodsByDefault:true}
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views','./views');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;