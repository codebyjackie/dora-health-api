const mysql = require('mysql2')

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'dora_health_db'
})

module.exports = db
