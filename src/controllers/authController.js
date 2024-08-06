const jsonwebtoken = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')
const AuthService = require('../services/authService')

// Handle user registration process
exports.register = (req, res) => {
  const userInfo = req.body

  AuthService.registerUser(userInfo, (err, results) => {
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

// Handle user login process
exports.login = (req, res) => {
  const userInfo = req.body

  AuthService.loginUser(userInfo, (err, user) => {
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

      AuthService.updateRefreshToken(user.id, refreshToken, (err) => {
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

// Handle refresh token process
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.sendResponse(400, 1, 'Refresh token is required')
  }

  jsonwebtoken.verify(refreshToken, jwtConfig.refreshTokenSecretKey, (err) => {
    if (err) {
      return res.sendResponse(401, 1, 'Login expired')
    }

    AuthService.findByRefreshToken(refreshToken, (err, results) => {
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
