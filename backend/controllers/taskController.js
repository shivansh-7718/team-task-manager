const Task = require('../models/Task');
const Project = require('../models/Project');

// GET all tasks for logged-in user (dashboard)
const getMyTasks = async (req, res) => {
    try {
      const tasks = await Task.find({
        $or: [
          { assignedTo: req.user._id },
          { createdBy: req.user._id }
        ]
      })
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name');
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// GET tasks for a specific project
const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create task
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, projectId } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      project: projectId,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyTasks, getProjectTasks, createTask, updateTask, deleteTask };