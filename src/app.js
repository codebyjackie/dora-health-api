const express = require('express')
const cors = require('cors')
const responseHandler = require('./middleware/responseHandler')
const jwtMiddleware = require('./middleware/jwtMiddleware')
const authRoutes = require('./routes/auth')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const port = 3000
const host = '192.168.36.46'

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors())

// Custom middleware to handle API responses
app.use(responseHandler)

// Middleware to parse URL-encoded data with the querystring library
app.use(express.urlencoded({ extended: false }))

// Middleware to parse incoming JSON requests
app.use(express.json())

// JWT middleware to protect routes and validate tokens
app.use(jwtMiddleware)

// Routes for login, registration, and refreshing tokens
app.use('/api', authRoutes)

// Custom middleware to handle errors
app.use(errorHandler)

// Start the server and listen on the specified host and port
app.listen(port, host, () => {
  console.log('api server running at http://192.168.36.46:3000')
})
