const router = require('express').Router()
const OrderController = require('../controllers/OrderController')

const adminAuth = require('../helpers/adminAuth').checkAdminAuth
const userAuth = require('../helpers/userAuth').checkUser

router.post('/approve', adminAuth, OrderController.approve)
router.get('/list/:id', adminAuth, OrderController.listOne)
router.get('/list', adminAuth, OrderController.list)
router.post('/myorders/delete', userAuth, OrderController.deleteOrder)
router.get('/myorders', userAuth, OrderController.myOrders)
router.post('/confirm', userAuth, OrderController.confirm)
router.post('/create', userAuth, OrderController.createOrderPost)
router.get('/create', userAuth, OrderController.createOrder)

module.exports = router