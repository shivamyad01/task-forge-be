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

// Get all profiles
app.get('/profiles', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM profiles');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new profile
app.post('/profiles', async (req, res) => {
  const { name, role } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.execute('INSERT INTO profiles (name, role) VALUES (?, ?)', [name, role]);
    connection.release();
    res.status(201).json({ message: 'Profile added successfully' });
  } catch (error) {
    console.error('Error adding profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a profile
app.put('/profiles/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.execute('UPDATE profiles SET name = ?, role = ? WHERE id = ?', [name, role, id]);
    connection.release();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Remove a profile
app.delete('/profiles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM profiles WHERE id = ?', [id]);
    connection.release();
    res.json({ message: 'Profile removed successfully' });
  } catch (error) {
    console.error('Error removing profile:', error);
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
  const { profileId, name, description, deadline, status } = req.body;
  try {
    // Check if the profileId exists in the users table
    const connection = await pool.getConnection();
    const [userRows] = await connection.query('SELECT * FROM users WHERE id = ?', [profileId]);
    connection.release();

    if (userRows.length === 0) {
      // If the profileId does not exist, return an error response
      return res.status(400).json({ error: 'Invalid profileId' });
    }

    // If the profileId is valid, proceed with inserting the task
    const newTask = { profileId, name, description, deadline, status };
    const insertTaskQuery = 'INSERT INTO tasks SET ?';
    const taskConnection = await pool.getConnection();
    await taskConnection.query(insertTaskQuery, [newTask]);
    taskConnection.release();

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

// Route to remove a task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
    connection.release();
    res.json({ message: 'Task removed successfully' });
  } catch (err) {
    console.error('Error removing task:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
