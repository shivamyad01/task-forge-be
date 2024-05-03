const pool = require('../models/db');

// Route to fetch all tasks
exports.getAllTasks = async (req, res) => {
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
};

// Add a new task
exports.addTask = async (req, res) => {
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
};

// Route to update task status
exports.updateTaskStatus = async (req, res) => {
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
};

// Route to remove a task
exports.removeTask = async (req, res) => {
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
};

// Route to fetch overdue tasks
exports.getOverdueTasks = async (req, res) => {
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
};
