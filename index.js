const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db'); // Import the pool object from db.js
const bcrypt = require('bcrypt');
// Import userController
const userController = require('./src/controllers/userController');
// Import profileController
const profileController = require('./src/controllers/profileController');
// Import taskController
const taskController = require('./src/controllers/taskController');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());



// Define user routes
app.post('/api/users/login', userController.login);
app.post('/api/users/register', userController.register);

// Define profile routes
app.get('/api/profiles', profileController.getAllProfiles);
app.post('/api/profiles', profileController.addProfile);
app.put('/api/profiles/:id', profileController.updateProfile);
app.delete('/api/profiles/:id', profileController.removeProfile);

// Define task routes
app.get('/api/tasks', taskController.getAllTasks);
app.post('/api/tasks', taskController.addTask);
app.put('/api/tasks/:id', taskController.updateTaskStatus);
app.delete('/api/tasks/:id', taskController.removeTask);
app.get('/api/tasks/overdue', taskController.getOverdueTasks);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
