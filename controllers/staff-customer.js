const Customer = require("../models/customer");
const Order = require("../models/order");

function removeAccents(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

module.exports = {
    allCustomers: async (req, res) => {
        try {
            if (req.query.q){
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const skip = (page - 1) * limit;
                const allCustomersReal = await Customer.find();
    
                const searchInfo = req.query.q;
                const searchCustomers = allCustomersReal.filter((element) => {
                    return (
                        removeAccents(element.fullName.toLowerCase()).
                        includes(removeAccents(searchInfo.toLowerCase()))
                    );
                });
                const searchCustomersPag = searchCustomers.slice(skip, skip + limit);
                const totalCustomers = searchCustomers.length;
                const totalPages = Math.ceil(totalCustomers / limit);
    
                res.render('staff-customer', {
                    customers: searchCustomersPag,
                    currentPage: page,
                    totalPages: totalPages,
                    totalCustomers: searchCustomers.length,
                    search: true,
                    searchInfo: searchInfo
                });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
                const skip = (page - 1) * limit;
                const allCustomersReal = await Customer.find();
                const allCustomers = await Customer.find().skip(skip).limit(limit);
                const totalCustomers = await Customer.countDocuments();
                const totalPages = Math.ceil(totalCustomers / limit);
                res.render('staff-customer', {
                    customers: allCustomers,
                    currentPage: page,
                    totalPages: totalPages,
                    totalCustomers: allCustomersReal.length
                });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    findCustomers: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            const allCustomersReal = await Customer.find();

            const searchInfo = req.query.q;
            const searchCustomers = allCustomersReal.filter((element) => {
                return (
                    removeAccents(element.fullName.toLowerCase())
                    .includes(removeAccents(searchInfo.toLowerCase()))
                );
            });
            const searchCustomersPag = searchCustomers.slice(skip, skip + limit);
            const totalCustomers = searchCustomers.length;
            const totalPages = Math.ceil(totalCustomers / limit);

            res.render('staff-customer', {
                customers: searchCustomersPag,
                currentPage: page,
                totalPages: totalPages,
                totalCustomers: searchCustomers.length,
                search: true,
                searchInfo: searchInfo
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    getDetails: async(req,res) =>{
        try{
            const allOrderList = await Order.find()
            .populate('customer')
            .populate({
                path: 'orderItems',
                populate: {
                path: 'product',
                model: 'Product'
                }
            });
            const oderSelectedList = []
            allOrderList.forEach(e=>{
                if(parseInt(e.customer.phoneNumber)===parseInt(req.params.id)){
                    oderSelectedList.push(e)
                }
            })
            res.render('staff-customer-detail', {
                customer: oderSelectedList[0].customer,
                orderList:oderSelectedList
            })
        } catch(error){
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    getDetailOrder: async(req,res)=>{
        const orderId =req.body.orderId
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
        res.render('staff-customer-detail-order',{Orders:Orders})
    }
}