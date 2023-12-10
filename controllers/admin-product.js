const Product = require("../models/product");
const OrderItem = require("../models/orderItem")

function generateRandomString(length) {
    const characters = '123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
}

function removeAccents(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

module.exports = {
    newProduct : async (req,res) =>{
        if (!req.form.isValid) {
            console.log(req.form.errors[0]);
            res.render('admin-product-add',{error :req.form.errors[0]});
        } else{
            const newProduct = new Product({
                barcode: generateRandomString(9),
                name: req.body.name,
                importPrice: req.body.importPrice,
                retailPrice: req.body.retailPrice,
                category: req.body.category,
                brand: req.body.brand,
                country: req.body.country,
                creationDate: new Date()
            })
            newProduct.save()
            .then(function(data){
                //return res.json({success:true, message:"success", data:data});
                res.render('admin-product-add',{message: "Thêm sản phẩm thành công"})
            })
            .catch(function(err){
                return res.json({success:false, message:"false"});
            })
        }
    },
    deleteProduct: async(req,res)=>{
        try {
            const productId = req.params.id;
            const orderItemList = await OrderItem.find().populate('product');
            if (orderItemList.length!=0){
                var flag = 0;
                orderItemList.forEach(e=>{
                    if (e.product._id.toString() === productId.toString()){
                        flag = 1;
                    }
                })
                if (flag===1){
                    req.flash("error","Không thể xóa sản phẩm do tồn tại trong hóa đơn")
                    res.redirect('/admin/product');
                } else{
                    const deletedProduct = await Product.findByIdAndDelete(productId);
                    if (!deletedProduct) {
                      return res.status(404).json({ success: false, message: 'Product not found' });
                    }
                    req.flash("success","Xóa sản phẩm thành công")
                    res.redirect('/admin/product');
                } 
            } else{
                const deletedProduct = await Product.findByIdAndDelete(productId);
                if (!deletedProduct) {
                  return res.status(404).json({ success: false, message: 'Product not found' });
                }
                req.flash("success","Xóa sản phẩm thành công")
                res.redirect('/admin/product');
            }   
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    editProduct: async(req,res)=>{
        if (!req.form.isValid) {
            console.log(req.form.errors[0]);
            res.render('admin-product-edit',{error :req.form.errors[0]});
        } else{
            try {
                const productId = req.params.id;
                const updatedData = req.body; 
                const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
                if (!updatedProduct) {
                  return res.status(404).json({ success: false, message: 'Product not found' });
                }
                res.render('admin-product-edit',{product:updatedProduct, message:"Sửa sản phẩm thành công"})
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }
    },
    findProducts :async(req,res)=>{
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            const allProducts = await Product.find();
            const searchInfo = req.query.q;
            const searchProducts = allProducts.filter((element) => {
                return (
                    removeAccents(element.name.toLowerCase()).includes(
                        removeAccents(searchInfo.toLowerCase())) 
                    ||
                    element.barcode.includes(searchInfo)
                );
            });
            const searchProductsPag = searchProducts.slice(skip, skip + limit);
            const totalProducts = searchProducts.length;
            const totalPages = Math.ceil(totalProducts / limit);
            res.render('admin-product', {
                products: searchProductsPag,
                currentPage: page,
                totalPages: totalPages,
                totalProducts: searchProducts.length,
                search: true,
                searchInfo: searchInfo
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    deleteProducts: async (req, res) => {
        try {
            const orderItemList = await OrderItem.find().populate('product');
            const data = req.body.data.split('/');
            if (orderItemList.length!=0){
                if (req.body.data !== "") {
                    for (var productId of data) {
                        if (productId!==""){
                            var flag = 0
                            orderItemList.forEach(e=>{
                                if (e.product._id.toString() === productId.toString()){
                                    flag = 1;
                                }
                            }) 
                            if (flag===0){
                                var deletedProduct = await Product.findByIdAndDelete(productId);
                            }
                        } 
                    }  
                    res.json({ success: true, message: 'Products deleted successfully' });
                } else{
                    res.json({ success: false, message: 'No product Id to delete'});
                }
            } else{
                if (req.body.data !== "") {
                    for (var productId of data) {
                        if (productId!==""){
                            var deletedProduct = await Product.findByIdAndDelete(productId);
                        } 
                    }  
                    res.json({ success: true, message: 'Products deleted successfully' });
                } else{
                    res.json({ success: false, message: 'No product Id to delete'});
                }
            }  
        } catch (error) {
          res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    allProducts: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            if (req.query.q){
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const skip = (page - 1) * limit;
                const allProducts = await Product.find();
                const searchInfo = req.query.q;
                const searchProducts = allProducts.filter((element) => {
                    return (
                        removeAccents(element.name.toLowerCase()).includes(
                            removeAccents(searchInfo.toLowerCase())) 
                        ||
                        element.barcode.includes(searchInfo)
                    );
                });
                const searchProductsPag = searchProducts.slice(skip, skip + limit);
                const totalProducts = searchProducts.length;
                const totalPages = Math.ceil(totalProducts / limit);
                res.render('admin-product', {
                    products: searchProductsPag,
                    currentPage: page,
                    totalPages: totalPages,
                    totalProducts: searchProducts.length,
                    search: true,
                    searchInfo: searchInfo
                });  
            }    
            const limit = 10;
            const skip = (page - 1) * limit;
            const allProductsReal = await Product.find();
            const allProducts = await Product.find().skip(skip).limit(limit);
            const totalProducts = await Product.countDocuments();
            const totalPages = Math.ceil(totalProducts / limit);
            res.render('admin-product', {
                products: allProducts,
                currentPage: page,
                totalPages: totalPages,
                totalProducts: allProductsReal.length
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}