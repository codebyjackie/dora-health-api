const UserService = require('../services/userService')

// Handle user profile retrieval
exports.profile = (req, res) => {
  const userId = req.auth.id

  UserService.getUserProfile(userId, (err, results) => {
    if (err) {
      if (err.message === 'User not found') {
        return res.sendResponse(404, 1, err.message)
      }
      return res.sendResponse(500, 1, err.message)
    }
    res.sendResponse(200, 0, 'User profile loaded successfully', {
      ...results[0]
    })
  })
}

// Handle update of user's basic information
exports.updateBasicInfo = (req, res) => {
  const userId = req.auth.id
  const userBasicData = {
    email: req.body.email,
    nickname: req.body.nickname,
    avatar: req.body.avatar
  }

  UserService.updateUserBasicInfo(userId, userBasicData, (err, results) => {
    if (err) {
      return res.sendResponse(500, 1, err.message)
    }
    res.sendResponse(200, 0, 'User basic info updated successfully', results)
  })
}

// Handle update of user's detailed information
exports.updateDetails = (req, res) => {
  const userId = req.auth.id
  const userDetails = {
    height: req.body.height,
    gender: req.body.gender,
    weight: req.body.weight,
    birthdate: req.body.birthdate
  }

  UserService.updateUserDetails(userId, userDetails, (err, results) => {
    if (err) {
      return res.sendResponse(500, 1, err.message)
    }
    res.sendResponse(200, 0, 'User details updated successfully', results)
  })
}
