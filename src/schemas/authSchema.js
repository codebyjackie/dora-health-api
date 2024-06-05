const Joi = require('joi')

// Define the email validation schema
const email = Joi.string().email().required().messages({
  'string.email': 'Invalid email format', // Message for invalid email format
  'string.empty': 'Email is required', // Message for empty email field
  'any.required': 'Email is required' // Message for missing email field
})

// Define the password validation schema
const password = Joi.string()
  .min(6) // Minimum length of 6 characters
  .pattern(/[a-zA-Z]/, { name: 'letter' }) // Must contain at least one letter
  .pattern(/[0-9]/, { name: 'number' }) // Must contain at least one number
  .pattern(/[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/]/, { name: 'special character' }) // Must contain at least one special character
  .required() // Password field is required
  .messages({
    'string.min': 'Password must be at least 6 characters long', // Message for short password
    'string.empty': 'Password is required', // Message for empty password field
    'any.required': 'Password is required', // Message for missing password field
    'string.pattern.name': 'Password must contain at least one {#name}' // Custom message for pattern matching errors
  })

// Define the confirm password validation schema
const repassword = Joi.string().valid(Joi.ref('password')).required().messages({
  'any.only': 'Passwords do not match', // Message for non-matching passwords
  'string.empty': 'Confirm Password is required', // Message for empty confirm password field
  'any.required': 'Confirm Password is required' // Message for missing confirm password field
})

// Define the registration schema
const registerSchema = {
  body: {
    email, // Email field must match the email validation schema
    password, // Password field must match the password validation schema
    repassword // Confirm password field must match the repassword validation schema
  }
}

// Define the login schema
const loginSchema = {
  body: {
    email, // Email field must match the email validation schema
    password // Password field must match the password validation schema
  }
}

// Export all user-related validation schemas
module.exports = {
  registerSchema,
  loginSchema
}
