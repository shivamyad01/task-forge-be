require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
});
