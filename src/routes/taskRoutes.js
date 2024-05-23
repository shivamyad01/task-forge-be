const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);
router.post('/', taskController.addTask);
router.put('/:id', taskController.updateTaskStatus);
router.delete('/:id', taskController.removeTask);
router.get('/overdue', taskController.getOverdueTasks);

module.exports = router;
