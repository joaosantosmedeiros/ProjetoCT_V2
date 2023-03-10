const router = require('express').Router()
const ProductController = require('../controllers/ProductController')

const adminAuth = require('../helpers/adminAuth').checkAdminAuth

router.post('/edit', adminAuth, ProductController.editPost)
router.get('/edit/:id', adminAuth, ProductController.edit)
router.post('/delete', adminAuth, ProductController.delete)
router.get('/list/:id', adminAuth, ProductController.showOne)
router.get('/list', adminAuth, ProductController.show)
router.post('/add', adminAuth, ProductController.createPost)
router.get('/add', adminAuth, ProductController.create)

module.exports = router