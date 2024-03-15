require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Import mysql2 with promise support
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Route to check login credentials
app.post('/checkLogin', async (req, res) => {
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

// Route to register a new user
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();
    await connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    connection.release();
    res.json({ registered: true });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM tasks');
    connection.release();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new task
app.post('/tasks', async (req, res) => {
  const newTask = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query('INSERT INTO tasks SET ?', [newTask]);
    connection.release();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update task status
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.execute('UPDATE tasks SET status = ? WHERE id = ?', [status, taskId]);
    connection.release();
    res.json({ message: 'Task status updated successfully' });
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
