const Task = require('../models/Tasks');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
    .sort({ updatedAt: -1 })
  .lean() // Add .lean() to get plain JavaScript objects
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false, 
        error: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
        count: tasks.length,
      data: task
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Check for duplicate title in the same status for this user
    const duplicate = await Task.findOne({
      title: req.body.title,
      status: req.body.status || 'To Do',
      user: req.user.id
    });
    // For createTask
req.body.assignees = req.body.assignees.map(assignee => ({
  id: assignee.id,
  name: assignee.name,
  avatar: assignee.avatar,
  initials: assignee.initials,
  color: assignee.color
}));
    if (duplicate) {
      return res.status(400).json({
        success: false,
        error: 'Task title must be unique within the same status group'
      });
    }
    
    const task = await Task.create(req.body);
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error('Error in createTask:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
if (req.body.assignees) {
  req.body.assignees = req.body.assignees.map(assignee => ({
    id: assignee.id,
    name: assignee.name,
    avatar: assignee.avatar,
    initials: assignee.initials,
    color: assignee.color
  }));
}
    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false, 
        error: 'Not authorized to update this task'
      });
    }
    
    // Check for duplicate title if title or status is being updated
    if (req.body.title || req.body.status) {
      const title = req.body.title || task.title;
      const status = req.body.status || task.status;
      
      const duplicate = await Task.findOne({
        title,
        status,
        user: req.user.id,
        _id: { $ne: req.params.id }
      });
      
      if (duplicate) {
        return res.status(400).json({
          success: false,
          error: 'Task title must be unique within the same status group'
        });
      }
    }
    
    // Always update the updatedAt field
    req.body.updatedAt = Date.now();
    
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false, 
        error: 'Not authorized to delete this task'
      });
    }
    
    await task.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};