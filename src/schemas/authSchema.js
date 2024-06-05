// schemas/userSchema.js
const Joi = require('joi')

const email = Joi.string().email().required().messages({
  'string.email': 'Invalid email format',
  'string.empty': 'Email is required',
  'any.required': 'Email is required'
})

const password = Joi.string().min(6).required().messages({
  'string.min': 'Password must be at least 6 characters long',
  'string.empty': 'Password is required',
  'any.required': 'Password is required'
})

const repassword = Joi.string().valid(Joi.ref('password')).required().messages({
  'any.only': 'Passwords do not match',
  'string.empty': 'Confirm Password is required',
  'any.required': 'Confirm Password is required'
})

const registerSchema = {
  body: {
    email,
    password,
    repassword
  }
}

const loginSchema = {
  body: {
    email,
    password
  }
}

// 导出所有的用户相关验证模式
module.exports = {
  registerSchema,
  loginSchema
}
