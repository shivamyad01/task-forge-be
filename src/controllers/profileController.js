const pool = require('../config/db');

// Get all profiles
async function getAllProfiles(req, res) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM profiles');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Add a new profile
async function addProfile(req, res) {
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
}

// Update a profile
async function updateProfile(req, res) {
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
}

// Remove a profile
async function removeProfile(req, res) {
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
}

module.exports = {
  getAllProfiles,
  addProfile,
  updateProfile,
  removeProfile,
};
