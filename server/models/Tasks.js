const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
    trim: true
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  dueDate: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: false
  },
  categoryColor: {
    type: String,
    required: false
  },
 assignees: [{
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: String,
  initials: String,
  color: String
}],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Pre-save middleware to update the updatedAt field
TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check for duplicate title in the same status group and for the same user
TaskSchema.pre('save', async function(next) {
  if (this.isModified('title') || this.isModified('status')) {
    const duplicateTask = await this.constructor.findOne({
      title: this.title,
      status: this.status,
      user: this.user,
      _id: { $ne: this._id }
    });
    
    if (duplicateTask) {
      const error = new Error('Task title must be unique within the same status group');
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Task', TaskSchema);