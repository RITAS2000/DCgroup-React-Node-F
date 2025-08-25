import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: false,
});

export const searchRecipes = createAsyncThunk(
  'recipes/search',
  async ({ title, category, ingredient, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/recipes', {
        params: { title, category, ingredient, page },
      });
      return data.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return rejectWithValue('Recipe not found');
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);
