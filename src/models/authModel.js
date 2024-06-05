const db = require('../config/db')
const bcrypt = require('bcryptjs')

exports.findByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email=?'
  db.query(sql, email, (err, results) => {
    if (err) return callback(err)
    callback(null, results)
  })
}

exports.createUser = (userInfo, callback) => {
  const sql = 'INSERT INTO users SET ?'
  db.query(sql, userInfo, (err, results) => {
    if (err) return callback(err)
    callback(null, results)
  })
}

exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10)
}

exports.comparePassword = (inputPassword, storedPassword) => {
  return bcrypt.compareSync(inputPassword, storedPassword)
}
