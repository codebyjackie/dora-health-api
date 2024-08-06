const joi = require('joi')

const errorHandler = (err, req, res, next) => {
  console.log(err)
  if (err instanceof joi.ValidationError) {
    // Joi validation error
    const errorMessages = err.details.map((detail) => ({
      key: detail.context.key,
      message: detail.message
    }))
    return res.sendResponse(400, 1, errorMessages)
  } else if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    'body' in err
  ) {
    // JSON syntax error
    return res.sendResponse(400, 1, 'Invalid JSON format')
  } else if (err.name === 'UnauthorizedError') {
    // JWT authentication error
    return res.sendResponse(401, 1, 'Authentication failed')
  }

  // Other types of errors
  return res.sendResponse(500, 1, 'Internal server error')
}

module.exports = errorHandler
