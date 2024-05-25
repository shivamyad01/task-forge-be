const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', auth,taskController.getAllTasks);
router.post('/',auth, taskController.addTask);
router.put('/:id', auth,taskController.updateTaskStatus);
router.delete('/:id',auth, taskController.removeTask);
router.get('/overdue',auth,taskController.getOverdueTasks);

module.exports = router;
