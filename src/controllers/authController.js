const jsonwebtoken = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')
const Auth = require('../models/authModel')

/**
 * This function handles the user registration process.
 * It checks if the provided email already exists in the database, encrypts the password,
 * stores the new user's information in the database, and returns an appropriate response.
 */

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

/**
 * This function handles the user login process.
 * It checks if the provided email exists in the database, verifies the password,
 * generates a JWT token and a refresh token if necessary, and returns the tokens
 * along with the user's avatar to the client.
 */

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
      return res.sendResponse(401, 1, 'Email not found')
    }

    // Check if the provided password matches the stored password
    const user = results[0]
    const passwordIsValid = Auth.comparePassword(
      userInfo.password,
      user.password
    )
    if (!passwordIsValid) {
      // Send an unauthorized error response if the password is incorrect
      return res.sendResponse(401, 1, 'Incorrect password')
    }

    // Create a token payload without including the password
    const tokenPayload = {
      id: user.id,
      email: user.email
    }

    // Generate a JWT token with the payload and the secret key
    const token = jsonwebtoken.sign(
      tokenPayload,
      jwtConfig.accessTokenSecretKey,
      {
        expiresIn: jwtConfig.accessTokenExpiresIn
      }
    )

    // Check if a refresh token already exists for the user
    let refreshToken = user.refresh_token
    if (!refreshToken) {
      // Generate a new refresh token if one does not exist
      refreshToken = jsonwebtoken.sign(
        tokenPayload,
        jwtConfig.refreshTokenSecretKey,
        {
          expiresIn: jwtConfig.refreshTokenExpiresIn
        }
      )

      // Update the user's refresh token in the database
      Auth.updateRefreshToken(user.id, refreshToken, (err) => {
        if (err) {
          // Send a server error response if there's an issue with updating the database
          return res.sendResponse(500, 1, err.message)
        }

        // Send a success response with the token, refresh token, and user avatar
        res.sendResponse(200, 0, 'Login successful', {
          token,
          refreshToken,
          avatar: user.avatar
        })
      })
    } else {
      // Send a success response with the token and user avatar
      res.sendResponse(200, 0, 'Login successful', {
        token,
        refreshToken,
        avatar: user.avatar
      })
    }
  })
}

/**
 * This function handles the refresh token process.
 * It verifies the provided refresh token, checks its validity in the database,
 * and generates a new access token if the refresh token is valid.
 * The new access token is then returned to the client.
 */

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body

  // Check if refresh token is provided in the request body
  if (!refreshToken) {
    return res
      .status(400)
      .json({ code: 1, message: 'Refresh token is required' })
  }

  // Verify the refresh token
  jsonwebtoken.verify(refreshToken, jwtConfig.refreshTokenSecretKey, (err) => {
    if (err) {
      return res.status(401).json({ code: 1, message: 'Invalid refresh token' })
    }

    // Find the refresh token in the database
    Auth.findByRefreshToken(refreshToken, (err, results) => {
      if (err) {
        return res.status(500).json({ code: 1, message: err.message })
      }
      if (results.length !== 1) {
        return res
          .status(401)
          .json({ code: 1, message: 'Invalid refresh token' })
      }

      const user = results[0]
      const tokenPayload = {
        id: user.id,
        email: user.email
      }

      // Create a new access token
      const newToken = jsonwebtoken.sign(
        tokenPayload,
        jwtConfig.accessTokenSecretKey,
        {
          expiresIn: jwtConfig.accessTokenExpiresIn
        }
      )

      // Send the new token to the client
      res.status(200).json({
        code: 0,
        message: 'Token refreshed',
        data: { token: newToken }
      })
    })
  })
}
