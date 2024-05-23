const pool = require('../config/db');

// Get user by email
async function getUserByEmail(email) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();
    return rows[0];
  } catch (err) {
    throw err;
  }
}

// Create user
async function createUser(name, email, password) {
  try {
    const connection = await pool.getConnection();
    await connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    connection.release();
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getUserByEmail,
  createUser,
};
