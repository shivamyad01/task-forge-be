const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import the pool object from db.js
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    // Check if the user already exists
    const [existingUsers] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      // If user already exists, send a message
      res.json({ alreadyExists: true });
    } else {
      // If user does not exist, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
      res.json({ registered: true });
    }

    connection.release();
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
