const jsonwebtoken = require('jsonwebtoken')
const config = require('../config/jwt')
const Auth = require('../models/authModel')

// User registration
exports.register = (req, res) => {
  const userInfo = req.body

  // Check if the email address already exists in the database
  Auth.findByEmail(userInfo.email, (err, results) => {
    if (err) {
      // Send a server error response if there's an issue with the database query
      return res.sendResponse(500, 1, err.message)
    }
    if (results.length > 0) {
      // Send a conflict error response if the email is already registered
      return res.sendResponse(409, 1, 'Email already exists')
    }

    // Encrypt the user's password before storing it in the database
    userInfo.password = Auth.hashPassword(userInfo.password)

    // Register the new user in the database
    Auth.createUser(
      { email: userInfo.email, password: userInfo.password },
      (err, results) => {
        if (err) {
          // Send a server error response if there's an issue with the database query
          return res.sendResponse(500, 1, err.message)
        }
        if (results.affectedRows !== 1) {
          // Send a server error response if the user registration fails
          return res.sendResponse(500, 1, 'Failed to register')
        }
        // Send a success response if the user is successfully registered
        res.sendResponse(201, 0, 'Successfully registered', userInfo)
      }
    )
  })
}

exports.login = (req, res) => {
  const userInfo = req.body

  // Check if the email exists in the database
  Auth.findByEmail(userInfo.email, (err, results) => {
    if (err) {
      // Send a server error response if there's an issue with the database query
      return res.sendResponse(500, 1, err.message)
    }
    if (results.length !== 1) {
      // Send an unauthorized error response if the email is not found
      return res.sendResponse(401, 1, 'Login failed')
    }

    // Check if the provided password matches the stored password
    const user = results[0]
    const passwordIsValid = Auth.comparePassword(
      userInfo.password,
      user.password
    )
    if (!passwordIsValid) {
      // Send an unauthorized error response if the password is incorrect
      return res.sendResponse(401, 1, 'Login failed')
    }

    // Create a token payload without including the password
    const tokenPayload = {
      id: user.id,
      email: user.email
    }

    // Generate a JWT token with the payload and the secret key
    const token = jsonwebtoken.sign(tokenPayload, config.jwtSecretKey, {
      expiresIn: config.jwtExpiresIn
    })

    // Send a success response with the token and user avatar
    res.sendResponse(200, 0, 'Login successful', { token, avatar: user.avatar })
  })
}
