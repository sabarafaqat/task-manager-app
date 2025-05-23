import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';
import type { Task } from '../../types/kanban';


interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get user tasks
export const getTasks = createAsyncThunk<Task[], void, { state: any }>(
  'tasks/getAll',
  async (_: void, thunkAPI: { getState: () => any; rejectWithValue: (value: any) => any }) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await taskService.getTasks(token);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Create task
export const createTask = createAsyncThunk<Task, Task, { state: any }>(
  'tasks/create',
  async (taskData , thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const created = await taskService.createTask(taskData, token);
      // Map _id to id if needed
      return { ...created, id: created._id ?? created.id };
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user task
export const deleteTask = createAsyncThunk<string, string, { state: any }>(
  'tasks/delete',
  async (id: string, thunkAPI: { getState: () => any; rejectWithValue: (value: any) => any }) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await taskService.deleteTask(id, token);
      return id;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk<Task, { id: string; taskData: Partial<Task> }, { state: any }>(
  'tasks/update',
  async (
    { id, taskData }: { id: string; taskData: Partial<Task> },
    thunkAPI: { getState: () => any; rejectWithValue: (value: any) => any }
  ) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await taskService.updateTask(id, taskData, token);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
    .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload
        );
      })
      .addCase(deleteTask.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;
