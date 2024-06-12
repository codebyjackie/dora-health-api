const jsonwebtoken = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')
const authService = require('../services/authService')

/**
 * This function handles the user registration process.
 * It checks if the provided email already exists in the database, encrypts the password,
 * stores the new user's information in the database, and returns an appropriate response.
 */
exports.register = (req, res) => {
  const userInfo = req.body

  authService.registerUser(userInfo, (err, results) => {
    if (err) {
      if (err.message === 'Email already exists') {
        return res.sendResponse(409, 1, err.message)
      }
      return res.sendResponse(500, 1, err.message)
    }
    if (results.affectedRows !== 1) {
      return res.sendResponse(500, 1, 'Failed to register')
    }
    res.sendResponse(201, 0, 'Successfully registered', {
      email: userInfo.email
    })
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

  authService.loginUser(userInfo, (err, user) => {
    if (err) {
      if (
        err.message === 'Email not found' ||
        err.message === 'Incorrect password'
      ) {
        return res.sendResponse(401, 1, err.message)
      }
      return res.sendResponse(500, 1, err.message)
    }

    const tokenPayload = {
      id: user.id,
      email: user.email
    }

    const token = jsonwebtoken.sign(
      tokenPayload,
      jwtConfig.accessTokenSecretKey,
      {
        expiresIn: jwtConfig.accessTokenExpiresIn
      }
    )

    let refreshToken = user.refresh_token
    if (refreshToken) {
      try {
        // Verify if the existing refresh token is valid
        jsonwebtoken.verify(refreshToken, jwtConfig.refreshTokenSecretKey)
      } catch {
        // If the existing refresh token is invalid or expired, create a new one
        refreshToken = null
      }
    }
    if (!refreshToken) {
      refreshToken = jsonwebtoken.sign(
        tokenPayload,
        jwtConfig.refreshTokenSecretKey,
        {
          expiresIn: jwtConfig.refreshTokenExpiresIn
        }
      )

      authService.updateRefreshToken(user.id, refreshToken, (err) => {
        if (err) {
          return res.sendResponse(500, 1, err.message)
        }

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          path: '/api/refresh-token'
        })

        res.sendResponse(200, 0, 'Login successful', {
          token,
          avatar: user.avatar
        })
      })
    } else {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/api/refresh-token'
      })

      res.sendResponse(200, 0, 'Login successful', {
        token,
        avatar: user.avatar
      })
    }
  })
}

/**
 * This function handles the refresh token process.
 * It verifies the provided refresh token from the cookie, checks its validity in the database,
 * and generates a new access token if the refresh token is valid.
 * The new access token is then returned to the client.
 */
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.sendResponse(400, 1, 'Refresh token is required')
  }

  jsonwebtoken.verify(refreshToken, jwtConfig.refreshTokenSecretKey, (err) => {
    if (err) {
      return res.sendResponse(401, 1, 'Login expired')
    }

    authService.findByRefreshToken(refreshToken, (err, results) => {
      if (err) {
        return res.sendResponse(500, 1, err.message)
      }
      if (results.length !== 1) {
        return res.sendResponse(401, 1, 'Invalid refresh token')
      }

      const user = results[0]
      const tokenPayload = {
        id: user.id,
        email: user.email
      }

      const newToken = jsonwebtoken.sign(
        tokenPayload,
        jwtConfig.accessTokenSecretKey,
        {
          expiresIn: jwtConfig.accessTokenExpiresIn
        }
      )

      res.sendResponse(200, 0, 'Token refreshed', { token: newToken })
    })
  })
}
