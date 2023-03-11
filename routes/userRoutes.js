const router = require('express').Router()

const UserController = require('../controllers/UserController')

const adminAuth = require('../helpers/adminAuth').checkAdminAuth
const anyAuth = require('../helpers/anyAuth').checkAnyAuth

router.post('/settings', anyAuth, UserController.settingsPost)
router.get('/settings', anyAuth, UserController.settings)
router.get('/list', adminAuth, UserController.list)

module.exports = router