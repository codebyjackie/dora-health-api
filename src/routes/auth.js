const express = require('express')
const router = express.Router()

// Import the controller
const AuthController = require('../controllers/authController')

// Import Joi validation middleware
const expressJoi = require('../middleware/expressJoi')
const { registerSchema, loginSchema } = require('../schemas/authSchema')

// Route for user registration
// Validates the request body against the registerSchema before passing it to the controller
router.post('/register', expressJoi(registerSchema), AuthController.register)

// Route for user login
// Validates the request body against the loginSchema before passing it to the controller
router.post('/login', expressJoi(loginSchema), AuthController.login)

// Route for refreshing the access token
router.post('/refresh-token', AuthController.refreshToken)

module.exports = router
