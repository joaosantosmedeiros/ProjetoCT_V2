const express = require('express')
const router = express.Router()

const anyAuth = require('../helpers/anyAuth').checkAnyAuth

const AuthController = require('../controllers/AuthController')

router.get('/dashboard', anyAuth, AuthController.dashboard)
router.get('/logout', AuthController.logout)
router.post('/login', AuthController.loginPost)
router.get('/login', AuthController.login)
router.post('/register', AuthController.registerPost)
router.get('/register', AuthController.register)
router.get('/', AuthController.home)

module.exports = router