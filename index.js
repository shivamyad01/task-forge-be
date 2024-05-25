require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const sequelize = require('./src/config/sequelize'); // Use Sequelize
const userController = require('./src/controllers/userController');
const profileController = require('./src/controllers/profileController');
const taskController = require('./src/controllers/taskController');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;



app.use(cors());
app.use(bodyParser.json()); // Add body parser

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

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync(); // This will create the tables if they don't exist
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
});