const router = require('express').Router()
const ProductController = require('../controllers/ProductController')

const adminAuth = require('../helpers/adminAuth').checkAdminAuth

router.post('/edit', adminAuth, ProductController.editPost)
router.get('/edit/:id', adminAuth, ProductController.edit)
router.post('/delete', adminAuth, ProductController.delete)
router.get('/list/:id', adminAuth, ProductController.listOne)
router.get('/list', adminAuth, ProductController.list)
router.post('/add', adminAuth, ProductController.createPost)
router.get('/add', adminAuth, ProductController.create)

module.exports = router