const router = require('express').Router()
const ProductController = require('../controllers/ProductController')

const adminAuth = require('../helpers/adminAuth').checkAdminAuth

router.get('/add', adminAuth, ProductController.add)

module.exports = router