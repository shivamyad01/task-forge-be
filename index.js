require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


app.post('/checkLogin', (req, res) => {
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
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      connection.query(insertQuery, [name, email, hashedPassword], (insertErr) => {
        if (insertErr) {
          console.error('Error inserting user into the database:', insertErr);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ registered: true });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
