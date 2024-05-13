const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import the pool object from db.js
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (rows.length > 0) {
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      res.json({ loggedIn: passwordMatch });
    } else {
      res.json({ loggedIn: false });
    }
  } catch (err) {
    console.error('Error checking login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
