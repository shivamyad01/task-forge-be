const bcrypt = require('bcrypt');
const connection = require('../database/connection');

const checkLogin = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        const user = results[0];

        bcrypt.compare(password, user.password, (bcryptErr, passwordMatch) => {
          if (bcryptErr) {
            console.error('Error comparing passwords:', bcryptErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            if (passwordMatch) {
              res.json({ loggedIn: true });
            } else {
              res.json({ loggedIn: false });
            }
          }
        });
      } else {
        res.json({ loggedIn: false });
      }
    }
  });
};

module.exports = { checkLogin };
