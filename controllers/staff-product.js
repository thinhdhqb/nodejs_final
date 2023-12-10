const Product = require("../models/product");

function removeAccents(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

module.exports = {
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
                res.render('staff-product', {
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
            res.render('staff-product', {
                products: allProducts,
                currentPage: page,
                totalPages: totalPages,
                totalProducts: allProductsReal.length
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error" });
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
            res.render('staff-product', {
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
}