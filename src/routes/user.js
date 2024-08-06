const express = require('express')
const router = express.Router()

// Import the controller
const UserController = require('../controllers/userController')

// Route for getting user profile
router.get('/profile', UserController.profile)

// Route for updating user's basic information
router.put('/profile/basic', UserController.updateBasicInfo)

// Route for updating user's detailed information
router.put('/profile/details', UserController.updateDetails)

module.exports = router
