const bcrypt = require('bcryptjs')
const AuthModel = require('../models/authModel')

// Hash a plaintext password using bcrypt
exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10)
}

// Compare an input password with the stored hashed password
exports.comparePassword = (inputPassword, storedPassword) => {
  return bcrypt.compareSync(inputPassword, storedPassword)
}

// Register a new user
exports.registerUser = (userInfo, callback) => {
  AuthModel.findByEmail(userInfo.email, (err, results) => {
    if (err) return callback(err)

    if (results.length > 0) {
      return callback(new Error('Email already exists'))
    }

    userInfo.password = exports.hashPassword(userInfo.password)
    AuthModel.createUser(
      { email: userInfo.email, password: userInfo.password },
      callback
    )
  })
}

// Login a user
exports.loginUser = (userInfo, callback) => {
  AuthModel.findByEmail(userInfo.email, (err, results) => {
    if (err) return callback(err)

    if (results.length !== 1) {
      return callback(new Error('Email not found'))
    }

    const user = results[0]
    const passwordIsValid = exports.comparePassword(
      userInfo.password,
      user.password
    )
    if (!passwordIsValid) {
      return callback(new Error('Incorrect password'))
    }

    callback(null, user)
  })
}

// Update refresh token
exports.updateRefreshToken = (userId, refreshToken, callback) => {
  AuthModel.updateRefreshToken(userId, refreshToken, callback)
}

// Find user by refresh token
exports.findByRefreshToken = (refreshToken, callback) => {
  AuthModel.findByRefreshToken(refreshToken, callback)
}
