const router = require('express').Router()

const UserController = require('../controllers/UserController')

const adminAuth = require('../helpers/adminAuth').checkAdminAuth
const anyAuth = require('../helpers/anyAuth').checkAnyAuth

router.post('/createAdmin', adminAuth, UserController.createAdminPost)
router.get('/createAdmin', adminAuth, UserController.createAdmin)
router.post('/delete', anyAuth, UserController.delete)
router.post('/settings', anyAuth, UserController.settingsPost)
router.get('/settings', anyAuth, UserController.settings)
router.get('/list', adminAuth, UserController.list)

module.exports = router