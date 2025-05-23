
import axios from 'axios';
import type { Task } from '../types/kanban';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/tasks/';

// Transform MongoDB document to frontend Task format
const transformTask = (dbTask: any): Task => {
  return {
    id: dbTask._id || dbTask.id,
    title: dbTask.title,
    description: dbTask.description || '',
    status: dbTask.status,
    dueDate: dbTask.dueDate,
    createdAt: dbTask.createdAt,
    updatedAt: dbTask.updatedAt,
    category: dbTask.category || '',
    categoryColor: dbTask.categoryColor || 'bg-gray-500',
    assignees: dbTask.assignees?.map((assignee: any) => ({
      id: assignee.id,
      name: assignee.name,
      avatar: assignee.avatar || '',
      initials: assignee.initials ||  'U',
      color: assignee.color || 'bg-red-400'
    })) || [],
  };
};

const transformForDB = (task: Task): any => {
  return {
    title: task.title,
    description: task.description || '',
    status: task.status,
    dueDate: task.dueDate,
    category: task.category || '',
    categoryColor: task.categoryColor || 'bg-red-400',
    assignees: task.assignees.map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      initials: user.initials,
      color: user.color
    })) || [],
  };
};
// Create new task
const createTask = async (taskData: Task, token: string): Promise<Task> => {
  console.log('Token used for createTask:', token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const transformedData = transformForDB(taskData);
  
  try {
    const response = await axios.post(API_URL, transformedData, config);
    return transformTask(response.data.data);
    
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Get user tasks
const getTasks = async (token: string): Promise<Task[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(API_URL, config);
    return response.data.data.map(transformTask);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Delete user task
const deleteTask = async (taskId: string, token: string): Promise<{ id: string }> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    await axios.delete(API_URL + taskId, config);
    return { id: taskId };
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Update a task
const updateTask = async (taskId: string, taskData: Task, token: string): Promise<Task> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const transformedData = transformForDB(taskData);
  
  try {
    const response = await axios.put(API_URL + taskId, transformedData, config);
    return transformTask(response.data.data);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

const taskService = {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
};

export default taskService;