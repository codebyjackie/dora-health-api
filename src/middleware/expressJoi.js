const Joi = require('joi')

const expressJoi = (schemas, options = { strict: false }) => {
  // Custom validation options
  // 'strict' is a custom property; by default, strict mode is off, which will filter out undefined parameters
  // If 'strict' is set to true, strict mode is on, and undefined parameters will not be filtered out
  if (!options.strict) {
    options = { allowUnknown: true, stripUnknown: true, ...options }
  }

  // Remove the custom 'strict' property from the options object
  const joiOptions = { ...options, abortEarly: false }
  delete joiOptions.strict

  return (req, res, next) => {
    try {
      // Iterate over the parts of the request to be validated
      for (const key of ['body', 'query', 'params']) {
        if (schemas[key]) {
          // Perform validation
          const schema = Joi.object(schemas[key])
          const { error, value } = schema.validate(req[key], joiOptions)

          if (error) {
            // Validation failed, return a 400 error
            return next(error)
          }

          // Validation succeeded, reassign the validated data to req[key]
          req[key] = value
        }
      }

      // Validation passed
      next()
    } catch (error) {
      // Catch any errors and pass them to the Express error handler
      next(error)
    }
  }
}

module.exports = expressJoi
