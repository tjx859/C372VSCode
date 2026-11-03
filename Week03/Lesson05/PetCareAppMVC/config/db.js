const mysql = require('mysql2');

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rp.25002069',
  database: 'petcare'
});

module.exports = connection;
