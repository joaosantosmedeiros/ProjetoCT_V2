const Product = require('../models/Product')

module.exports = class ProductController{

    static add(req, res){
        res.render('products/add')
    }

}