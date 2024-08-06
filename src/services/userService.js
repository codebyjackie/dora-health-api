const UserModel = require('../models/userModel')

// Retrieve user profile by user ID
exports.getUserProfile = (userId, callback) => {
  UserModel.findUserById(userId, (err, results) => {
    if (err) return callback(err)
    if (results.length !== 1) {
      return callback(new Error('User not found'))
    }
    callback(null, results)
  })
}

// Update user's basic information
exports.updateUserBasicInfo = (userId, userBasicData, callback) => {
  // Filter userBasicData to include only fields with defined values
  userBasicData = Object.fromEntries(
    Object.entries(userBasicData).filter(([, value]) => value !== undefined)
  )

  UserModel.updateUserBasicInfo(userId, userBasicData, (err, results) => {
    if (err) return callback(err)
    if (results.affectedRows === 0) {
      return callback(new Error('User not found or no changes made'))
    }
    callback(null, results)
  })
}

// Update user's detailed information
exports.updateUserDetails = (userId, userDetails, callback) => {
  // Filter userDetails to include only fields with defined values
  userDetails = Object.fromEntries(
    Object.entries(userDetails).filter(([, value]) => value !== undefined)
  )

  UserModel.updateUserDetails(userId, userDetails, (err, results) => {
    if (err) return callback(err)
    if (results.affectedRows === 0) {
      return callback(new Error('User not found or no changes made'))
    }
    callback(null, results)
  })
}
