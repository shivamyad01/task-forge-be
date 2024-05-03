// const bcrypt = require('bcrypt');
// const connection = require('../database/connection');

// const register = (req, res) => {
//   const { name, email, password } = req.body;

//   bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) {
//       console.error('Error hashing password:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
//       connection.query(insertQuery, [name, email, hashedPassword], (insertErr) => {
//         if (insertErr) {
//           console.error('Error inserting user into the database:', insertErr);
//           res.status(500).json({ error: 'Internal Server Error' });
//         } else {
//           res.json({ registered: true });
//         }
//       });
//     }
//   });
// };

// module.exports = { register };
