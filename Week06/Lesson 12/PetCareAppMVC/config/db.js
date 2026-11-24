const mysql = require('mysql2');

// MySQL Connection
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'SoiDft2026',
  database: 'petcare',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = connection;
