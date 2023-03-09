const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/AuthController')

router.get('/', AuthController.home)
router.post('/register', AuthController.registerPost)
router.get('/register', AuthController.register)

module.exports = router