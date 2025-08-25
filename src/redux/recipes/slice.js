import { createSlice } from '@reduxjs/toolkit';
import { searchRecipes } from './operations';

const initialState = {
  items: [],
  page: 1,
  perPage: 12,
  totalItems: 0,
  totalPages: 0,
  loading: false,
  error: null,
  query: '',
  searchMode: false,
  lastQuery: '', // 🟢 додав
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setLastQuery: (state, action) => {
      // 🟢 додав тут
      state.lastQuery = action.payload;
    },
    clearResults: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.searchMode = false;
      state.lastQuery = '';
    },
  },
  extraReducers: (b) => {
    b.addCase(searchRecipes.pending, (s) => {
      s.loading = true;
      s.error = null;
      s.searchMode = true;
    })
      .addCase(searchRecipes.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload.recipes || [];
        s.page = payload.page;
        s.perPage = payload.perPage || 12;
        s.totalItems = payload.totalItems || 0; // 🟢 змінив, було s.totalItems = payload.total || 0;
        s.totalPages = payload.totalPages || 0;
      })
      .addCase(searchRecipes.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
        s.items = [];
        s.searchMode = true;
      });
  },
});

export const { setLastQuery, clearResults } = recipesSlice.actions; // 🟢 setLastQuery змінив було setQuery
export default recipesSlice.reducer;
