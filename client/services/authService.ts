import axios from 'axios';
import type { User } from '../types/kanban';

export interface UserData {
  // Define the properties expected in userData, e.g.:
  name?: string;
  email: string;
  password?: string;
  [key: string]: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth/';


export const getAllUsers = async (token: string): Promise<User[]> => {

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'users', config); // Make sure your backend has this endpoint
  return response.data.data.map((user: any) => ({
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || '',
    initials: user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U',
    color: `bg-${['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo'][Math.floor(Math.random() * 7)]}-500`
  }));
   
};

// Register user
const register = async (userData: UserData): Promise<any> => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data?.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

const login = async (userData: UserData): Promise<any> => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data?.user && response.data?.token) {
    // Store both user and token in localStorage
    const userWithToken = { ...response.data.user, token: response.data.token };
    localStorage.setItem('user', JSON.stringify(userWithToken));
  }

  return response.data;
};

// Logout user
const logout = (): void => {
  localStorage.removeItem('user');
};

// Get current logged in user
const getMe = async (token: string): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'me', config);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
};

export default authService;
