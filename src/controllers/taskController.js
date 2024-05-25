const { Op } = require('sequelize');
const Task = require('../../models/task');
const Profile = require('../../models/profile'); // Corrected import

async function getAllTasks(req, res) {
  try {
    const tasks = await Task.findAll({ include: { model: Profile, as: 'Profile' } });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function addTask(req, res) {
  const { profileId, name, description, deadline, status } = req.body;
  if (!profileId || isNaN(parseInt(profileId))) {
    return res.status(400).json({ error: 'Invalid profileId' });
  }
  try {
    await Task.create({ profileId, name, description, deadline, status });
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateTaskStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await Task.update({ status }, { where: { id } });
    res.json({ message: 'Task status updated successfully' });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function removeTask(req, res) {
  const { id } = req.params;
  try {
    await Task.destroy({ where: { id } });
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error('Error removing task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getOverdueTasks(req, res) {
  try {
    const overdueTasks = await Task.findAll({
      where: {
        deadline: { [Op.lt]: new Date() },
        status: { [Op.ne]: 'completed' },
      },
      include: { model: Profile, as: 'Profile' }, // Use the correct alias here
    });
    res.json(overdueTasks);
  } catch (error) {
    console.error('Error fetching overdue tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getAllTasks,
  addTask,
  updateTaskStatus,
  removeTask,
  getOverdueTasks,
};
