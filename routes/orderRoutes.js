const router = require('express').Router()
const OrderController = require('../controllers/OrderController')

const userAuth = require('../helpers/userAuth').checkUser

router.post('/myorders/delete', userAuth, OrderController.deleteOrder)
router.get('/myorders', userAuth, OrderController.myOrders)
router.post('/confirm', userAuth, OrderController.confirm)
router.post('/create', userAuth, OrderController.createOrderPost)
router.get('/create', userAuth, OrderController.createOrder)

module.exports = router