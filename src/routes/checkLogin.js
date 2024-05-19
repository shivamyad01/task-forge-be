const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import the pool object from db.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (rows.length > 0) {
      const user = rows[0];
    
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Create a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ loggedIn: passwordMatch, data: user, token: token });
       
      }
    } else {
      res.json({ loggedIn: false });
    }
  } catch (err) {
    console.error('Error checking login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
