const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Controller functions

// Login controller
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Create a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ loggedIn: true, data: user, token: token });
      }
    }
    res.json({ loggedIn: false });
  } catch (err) {
    console.error('Error checking login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Register controller
async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.json({ alreadyExists: true });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.createUser(name, email, hashedPassword);
      return res.json({ registered: true });
    }
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  login,
  register,
};
