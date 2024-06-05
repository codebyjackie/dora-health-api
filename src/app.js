const express = require('express')
const cors = require('cors')
const responseHandler = require('./middleware/responseHandler')
const jwtMiddleware = require('./middleware/jwtMiddleware')
const userRouter = require('./routes/auth')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const port = 3000
const host = '192.168.36.46'

// Enable CORS
app.use(cors())

// Custom response handler middleware
app.use(responseHandler)

// Parse application/x-www-form-urlencoded and JSON
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// JWT authentication middleware
app.use(jwtMiddleware)

// User API router
app.use('/api', userRouter)

// Global error handling middleware
app.use(errorHandler)

// Start the server
app.listen(port, host, () => {
  console.log('api server running at http://192.168.36.46:3000')
})
