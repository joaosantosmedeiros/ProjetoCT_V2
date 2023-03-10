const router = require('express').Router()

const UserController = require('../controllers/UserController')

const adminAuth = require('../helpers/adminAuth').checkAdminAuth

router.get('/list', adminAuth, UserController.list)

module.exports = router