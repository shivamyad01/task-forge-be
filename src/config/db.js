require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2/promise'); // Import mysql2 with promise support

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true, // To queue connection requests during high traffic
  connectionLimit: 10, // Limiting the number of connections to the database
  queueLimit: 0 // No limit to queued connection requests
});

module.exports = pool;
