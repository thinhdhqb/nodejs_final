var Product = require("../models/product");
var Customer = require("../models/customer");
var Order = require("../models/order");
var OrderItem = require("../models/orderItem");
var Employee = require("../models/employee");
var Account = require("../models/account");


function removeAccents(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

exports.getCart = function (req, res) {
    res.render("staff-cart", {
        title: "Thêm đơn hàng",
        cart: req.session.cart,
    });
};

exports.postCart = async function (req, res) {
    let barcodes = req.form.barcode;
    let quantities = req.form.quantity;
    if (barcodes.length === 0) {
        req.flash(
            "error",
            "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán."
        );
        return res.redirect("/staff/cart");
    }

    let products = await Product.find({ barcode: { $in: barcodes } }).exec();
    let cartItems = [];
    let total = 0;
    for (let i = 0; i < barcodes.length; i++) {
        let barcode = barcodes[i];
        let quantity = quantities[i];
        let product = products.find((p) => p.barcode === barcode);
        let subtotal = quantity * product.retailPrice;
        total += subtotal;
        cartItems.push({
            productId: product._id,
            barcode: barcode,
            quantity: quantity,
            name: product.name,
            price: product.retailPrice,
            subtotal: subtotal,
        });
    }

    req.session.cart = { items: cartItems, total: total };
    return res.redirect("/staff/cart/checkout");
};

exports.getCheckout = async function (req, res) {
    res.render("staff-cart-checkout", {
        title: "Thanh toán",
        cart: req.session.cart,
    });
};

exports.postCheckout = async function (req, res) {
    if (!req.form.isValid) {
        return res.redirect("/staff/cart/checkout");
    }
    const { phone, fullName, numberStreet, city, district, ward, amountGiven } =
        req.form;
    let address = numberStreet + ", " + ward + ", " + district + ", " + city;
    let cart = req.session.cart;
    if (amountGiven < cart.total) {
        req.flash(
            "error",
            "Số tiền khách gửi phải lớn hơn tổng tiền đơn hàng."
        );
        return res.redirect("/staff/cart/checkout");
    }

    let customer = await Customer.findOne({ phoneNumber: phone });
    if (customer == null) {
        if (!numberStreet || !city || !district || !ward) {
            req.flash(
                "error",
                "Vui lòng nhập đầy đủ địa chỉ."
            );
            return res.redirect("/staff/cart/checkout");
        }
        customer = await new Customer({
            phoneNumber: phone,
            address: address,
            fullName: fullName,
        }).save();
    }

    let orderItems = [];
    cart.items.forEach(async (item) => {
        orderItems.push(
            await new OrderItem({
                quantity: item.quantity,
                product: item.productId,
                subtotal: item.subtotal,
            }).save()
        );
    });
    let account = await Account.findById(req.session.userId).exec();
    let employee = await Employee.findOne({account: account})
        .populate('account')
        .exec();
    let order = await new Order({
        customer: customer,
        orderItems: orderItems,
        total: cart.total,
        amountGiven: amountGiven,
        creationDate: new Date(),
        createdBy: employee,
    }).save();

    await Employee.findOneAndUpdate(
        { _id: employee._id },
        {
            $push: { orders: order },
        },
        { new: true, safe: true, upsert: true }
    ).exec();
    req.session.cart = null;
    res.redirect("/staff/cart/invoice/" + order._id);
};

exports.getInvoice = async function(req, res) {
    let orderId = req.params.id;
    let order = await Order.findById(orderId).populate('customer').populate({ 
        path: 'orderItems',
        populate: {
          path: 'product',
          model: 'Product'
        } 
     }).populate('createdBy').exec();
    res.render('staff-cart-invoice', {title: "Hóa đơn", order: order})
}


exports.getCustomerByPhoneNumber = async function (req, res) {
    const phone = req.query.q;
    let customer = await Customer.findOne({ phoneNumber: phone }).exec();
    if (customer == null) return res.json({ success: false });
    return res.json({ success: true, data: customer });
};

// exports.searchProduct = async function(req,res

exports.searchProduct = async function (req, res) {
    try {
        const searchInfo = req.body.data;
        const searchProducts = await Product.find().exec();
        const filteredProducts = searchProducts.filter((element) => {
            return removeAccents(element.name.toLowerCase())
                .includes(removeAccents(searchInfo.toLowerCase()));
        });
        res.json({ data: filteredProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.searchProductByBarCode = async function(req,res){
    try {
        const searchInfo = req.body.data;
        const searchProducts = await Product.find().exec();
        const filteredProducts = searchProducts.filter((element) => {
            return parseInt(element.barcode) === parseInt(searchInfo)
        });
        res.json({ data: filteredProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
