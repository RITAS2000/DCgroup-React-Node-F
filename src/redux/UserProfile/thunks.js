import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const getErrorMessage = (e) =>
  e?.response?.data?.message || e?.message || 'Request failed';

function parsePageResponse(raw) {
  const box = raw?.data ?? raw;
  const items = box?.data ?? box?.recipes ?? box?.items ?? [];

  const totalPages =
    (typeof box?.totalPages === 'number' && box.totalPages) ??
    (typeof box?.data?.totalPages === 'number' && box.data.totalPages);

  return { items, totalPages, raw: box };
}

export const fetchOwn = createAsyncThunk(
  'profile/fetchOwn',
  async (
    { page = 1, limit = 12, replace = false } = {},
    { rejectWithValue, signal },
  ) => {
    try {
      const r = await api.get('/api/recipes/own', {
        params: { page, limit },
        signal,
      });
      const { items, totalPages, raw } = parsePageResponse(r.data);
      const tp =
        typeof totalPages === 'number'
          ? totalPages
          : Math.max(1, Math.ceil((raw?.totalItems ?? items.length) / limit));

      return { items, page, totalPages: tp, replace };
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

export const fetchSaved = createAsyncThunk(
  'profile/fetchSaved',
  async (
    { page = 1, limit = 12, replace = false } = {},
    { rejectWithValue, signal },
  ) => {
    try {
      const r = await api.get('/api/recipes/saved-recipes', {
        params: { page, limit },
        signal,
      });
      const { items, totalPages, raw } = parsePageResponse(r.data);
      const tp =
        typeof totalPages === 'number'
          ? totalPages
          : Math.max(1, Math.ceil((raw?.totalItems ?? items.length) / limit));

      return { items, page, totalPages: tp, replace };
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

export const removeSaved = createAsyncThunk(
  'profile/removeSaved',
  async (recipeId, { rejectWithValue, signal }) => {
    try {
      await api.delete(`/api/recipes/saved-recipes/${recipeId}`, { signal });
      return recipeId;
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);
