const db = require('../config/db')

// Find a user by their email address
exports.findByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email=?'
  db.query(sql, email, (err, results) => {
    if (err) return callback(err)
    callback(null, results)
  })
}

// Create a new user with the provided user information
exports.createUser = (userInfo, callback) => {
  const sql = 'INSERT INTO users SET ?'
  db.query(sql, userInfo, (err, results) => {
    if (err) return callback(err)
    callback(null, results)
  })
}

// Update the refresh token for a user with the given user ID
exports.updateRefreshToken = (userId, refreshToken, callback) => {
  const sql = 'UPDATE users SET refresh_token=? WHERE id=?'
  db.query(sql, [refreshToken, userId], (err, results) => {
    if (err) return callback(err)
    callback(null, results)
  })
}

// Find a user by their refresh token
exports.findByRefreshToken = (refreshToken, callback) => {
  const sql = 'SELECT * FROM users WHERE refresh_token=?'
  db.query(sql, refreshToken, (err, results) => {
    if (err) return callback(err)
    callback(null, results)
  })
}
