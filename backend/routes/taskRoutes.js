const express = require('express');
const router = express.Router();
const { getMyTasks, getProjectTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/my', getMyTasks);
router.get('/project/:projectId', getProjectTasks);
router.post('/', createTask);
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;