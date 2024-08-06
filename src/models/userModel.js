const db = require('../config/db')

// Find user by ID
exports.findUserById = (userId, callback) => {
  console.log(userId)
  const sql = `
    SELECT 
      users.id, 
      users.email, 
      users.nickname, 
      users.avatar, 
      user_details.height, 
      user_details.gender, 
      user_details.weight, 
      DATE_FORMAT(user_details.birthdate, '%Y-%m-%d') AS birthdate
    FROM users 
    LEFT JOIN user_details ON users.id = user_details.user_id 
    WHERE users.id = ?
  `
  db.query(sql, userId, (err, results) => {
    if (err) return callback(err)
    console.log(results)
    callback(null, results)
  })
}

// Update user's basic information
exports.updateUserBasicInfo = (userId, userData, callback) => {
  const fields = Object.keys(userData)
  const values = Object.values(userData)

  if (fields.length === 0) {
    return callback(new Error('No data to update'))
  }

  const setClause = fields.map((field) => `${field} = ?`).join(', ')
  const sql = `
    UPDATE users
    SET ${setClause}
    WHERE id = ?
  `

  values.push(userId)

  db.query(sql, values, (err, results) => {
    if (err) return callback(err)
    callback(null, results)
  })
}

// Update user's detailed information
exports.updateUserDetails = (userId, userDetails, callback) => {
  const fields = Object.keys(userDetails)
  const values = Object.values(userDetails)

  if (fields.length === 0) {
    return callback(new Error('No data to update'))
  }

  const setClause = fields.map((field) => `${field} = ?`).join(', ')
  const sql = `
    UPDATE user_details
    SET ${setClause}
    WHERE user_id = ?
  `

  values.push(userId)

  db.query(sql, values, (err, results) => {
    if (err) return callback(err)
    callback(null, results)
  })
}
