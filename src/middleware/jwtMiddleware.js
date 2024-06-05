const { expressjwt } = require('express-jwt')
const jwtConfig = require('../config/jwt')

const jwtMiddleware = expressjwt({
  secret: jwtConfig.accessTokenSecretKey,
  algorithms: ['HS256']
}).unless({
  path: [/^\/api\//]
})

module.exports = jwtMiddleware
