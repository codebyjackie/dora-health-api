const { expressjwt } = require('express-jwt')
const config = require('../config/jwt')

const jwtMiddleware = expressjwt({
  secret: config.jwtSecretKey,
  algorithms: ['HS256']
}).unless({
  path: [/^\/api\//]
})

module.exports = jwtMiddleware
