const express = require('express');
const exphbs = require('express-handlebars');

// Register the formatCurrencyVND helper
const hbs = exphbs.create({
  helpers: {
    formatCurrencyVND: function (value) {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        return 'Invalid input';
      }
      return numericValue.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },
  },
});

