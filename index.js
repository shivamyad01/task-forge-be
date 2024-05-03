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
  waitForConnections: true, // To queue connection requests during high traffic
  connectionLimit: 10, // Limiting the number of connections to the database
  queueLimit: 0 // No limit to queued connection requests
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


// Route to fetch all profiles
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
    const [rows] = await connection.query(`
      SELECT tasks.*, profiles.name AS profile_name
      FROM tasks
      LEFT JOIN profiles ON tasks.profile_id = profiles.id
    `);
    connection.release();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to add a task
app.post('/tasks', async (req, res) => {
  const { profileId, name, description, deadline, status } = req.body;

  // Check if profileId is a valid integer
  if (!profileId || isNaN(parseInt(profileId))) {
    return res.status(400).json({ error: 'Invalid profileId' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO tasks (profile_id, name, description, deadline, status) VALUES (?, ?, ?, ?, ?)',
      [parseInt(profileId), name, description, deadline, status]
    );
    connection.release();
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
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

// Route to fetch overdue tasks
app.get('/tasks/overdue', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT tasks.*, profiles.name AS profile_name
      FROM tasks
      LEFT JOIN profiles ON tasks.profile_id = profiles.id
      WHERE tasks.deadline < CURDATE() AND tasks.status != 'completed'
    `);
    connection.release();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching overdue tasks:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
