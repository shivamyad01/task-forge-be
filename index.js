
const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db'); // Import the pool object from db.js
const bcrypt = require('bcrypt');

// Import routes
const checkLoginRoute = require('./src/routes/checkLogin');
const registerRoute = require('./src/routes/register');
const profilesRoute = require('./src/routes/profiles');
const tasksRoute = require('./src/routes/tasks');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Use routes
app.use('/checkLogin', checkLoginRoute);
app.use('/register', registerRoute);
app.use('/profiles', profilesRoute);
app.use('/tasks', tasksRoute);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
