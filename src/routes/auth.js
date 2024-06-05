const express = require('express')
const router = express.Router()

// controller
const authController = require('../controllers/authController')

// joi
const expressJoi = require('../middleware/expressJoi')
const { registerSchema, loginSchema } = require('../schemas/authSchema')

// register
router.post('/register', expressJoi(registerSchema), authController.register)

// login
router.post('/login', expressJoi(loginSchema), authController.login)

module.exports = router
