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
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
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
        s.totalItems = payload.total || 0;
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

export const { setQuery, clearResults } = recipesSlice.actions;
export default recipesSlice.reducer;
