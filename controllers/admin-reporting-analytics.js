const Employee = require('../models/employee'); 
var emailSender = require('../utils/emailSender')
var jwt = require('../utils/jwt')
var Order = require('../models/order')
var OrderItem = require('../models/orderItem')
var bcrypt = require('bcrypt')
var Product = require('../models/product')
var Customer = require('../models/customer');
const order = require('../models/order');
exports.getAllOrders = async function(req, res){
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const Orders = await Order.find({
        creationDate: {
            $gte: today,
            $lt: tomorrow
        }
    })
        .populate({
            path: 'customer'
        })
        .populate({
            path:'orderItems',
            populate:'product'
        }).exec();
    let totalAmount = 0;
    let totalOrder = 0;
    let totalProduct = 0;
    Orders.forEach(order => {
        totalAmount += order.total;
        totalOrder +=1;
        order.orderItems.forEach(ot => {
            totalProduct += ot.quantity;
        })
    });
    
    res.render('admin-reporting-analytics', {  Orders: Orders, total:totalAmount, totalOrder:totalOrder, totalProduct:totalProduct, today:today });
}

exports.getAllOrdersYesterday = async function(req, res){

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
   
    const Orders = await Order.find({
        creationDate: {
            $gte: yesterday,
            $lt: today
        }
    })
        .populate({
            path: 'customer'
        })
        .populate({
            path:'orderItems',
            populate:'product'
        }).exec();
    Orders.sort((a, b) => a.creationDate - b.creationDate);
    let totalAmount = 0;
    let totalOrder = 0;
    let totalProduct = 0;
    Orders.forEach(order => {
        totalAmount += order.total;
        totalOrder +=1;
        order.orderItems.forEach(ot => {
            totalProduct += ot.quantity;
        })
    });
    
    res.render('admin-reporting-yesterday', {  Orders: Orders, total:totalAmount, totalOrder:totalOrder, totalProduct:totalProduct, yesterday:yesterday });
}

exports.getAllOrdersSevenDaysAgo = async function(req, res){

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set the time to the beginning of the day

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 7);
   
    const Orders = await Order.find({
        creationDate: {
            $gte: yesterday,
            $lte: today
        }
    })
        .populate({
            path: 'customer'
        })
        .populate({
            path:'orderItems',
            populate:'product'
        }).exec();
    Orders.sort((a, b) => a.creationDate - b.creationDate);
    let totalAmount = 0;
    let totalOrder = 0;
    let totalProduct = 0;
    Orders.forEach(order => {
        totalAmount += order.total;
        totalOrder +=1;
        order.orderItems.forEach(ot => {
            totalProduct += ot.quantity;
        })
    });
    
    res.render('admin-reporting-sevenDaysAgo', {  Orders: Orders, total:totalAmount, totalOrder:totalOrder, totalProduct:totalProduct, yesterday:yesterday, today:today });
}

exports.getAllOrdersThisMonth= async function(req, res){

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999); // Set the time to the end of the day
   
    const Orders = await Order.find({
        creationDate: {
            $gte: firstDayOfMonth,
            $lt: lastDayOfMonth
        }
    })
        .populate({
            path: 'customer'
        })
        .populate({
            path:'orderItems',
            populate:'product'
        }).exec();
    let totalAmount = 0;
    let totalOrder = 0;
    let totalProduct = 0;
    Orders.forEach(order => {
        totalAmount += order.total;
        totalOrder +=1;
        order.orderItems.forEach(ot => {
            totalProduct += ot.quantity;
        })
    });
    
    res.render('admin-reporting-thisMonth', {  Orders: Orders, total:totalAmount, totalOrder:totalOrder, totalProduct:totalProduct, yesterday:firstDayOfMonth, today:lastDayOfMonth });
}

exports.getAllOrdersThisMonth= async function(req, res){

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999); // Set the time to the end of the day
   
    const Orders = await Order.find({
        creationDate: {
            $gte: firstDayOfMonth,
            $lt: lastDayOfMonth
        }
    })
        .populate({
            path: 'customer'
        })
        .populate({
            path:'orderItems',
            populate:'product'
        }).exec();
    Orders.sort((a, b) => a.creationDate - b.creationDate);
    let totalAmount = 0;
    let totalOrder = 0;
    let totalProduct = 0;
    Orders.forEach(order => {
        totalAmount += order.total;
        totalOrder +=1;
        order.orderItems.forEach(ot => {
            totalProduct += ot.quantity;
        })
    });
    
    res.render('admin-reporting-thisMonth', {  Orders: Orders, total:totalAmount, totalOrder:totalOrder, totalProduct:totalProduct, yesterday:firstDayOfMonth, today:lastDayOfMonth });
}


exports.getAllOrdersArangeDay = async function(req, res){

    const dates = req.query.dates;
   
    let [startDate, endDate] = dates.split(' - ');
    let split = startDate.split("/");
    startDate = split[1] + '/' + split[0] + '/' + split[2];
    split = endDate.split("/");

    endDate = split[1] + '/' + split[0] + '/' + split[2];
    console.log(startDate)

    // Convert the string dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const Orders = await Order.find({
        creationDate: {
            $gte: start,
            $lt: end
        }
    })
        .populate({
            path: 'customer'
        })
        .populate({
            path:'orderItems',
            populate:'product'
        }).exec();
    Orders.sort((a, b) => a.creationDate - b.creationDate);
    let totalAmount = 0;
    let totalOrder = 0;

    let totalProduct = 0;
    Orders.forEach(order => {
        totalAmount += order.total;
        totalOrder +=1;
        order.orderItems.forEach(ot => {
            totalProduct += ot.quantity;
        })
    });
    
    res.render('admin-reporting-arangeDay', {  Orders: Orders, total:totalAmount, totalOrder:totalOrder, totalProduct:totalProduct, start:start, end:end});
}

exports.detailOrder = async function(req, res){
    const orderId = req.params.id;
    const Orders = await Order.findById(orderId)
        .populate({
            path: 'customer'
        })
        .populate({
            path: 'createdBy'
        })
        .populate({
            path:'orderItems',
            populate:'product'
        }).exec();
    console.log(Orders)
    res.render('admin-order-detail',{Orders:Orders})
}