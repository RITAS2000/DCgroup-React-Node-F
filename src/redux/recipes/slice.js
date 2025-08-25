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
  query: { title: '', category: '', ingredient: '' },
  searchMode: false,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setQuery(state, { payload }) {
      state.query = payload || { title: '', category: '', ingredient: '' };
    },
    clearResults(state) {
      state.items = [];
      state.page = 1;
      state.totalItems = 0;
      state.totalPages = 0;
      state.loading = false;
      state.error = null;
      state.searchMode = false;
      state.query = { title: '', category: '', ingredient: '' };
    },
  },
  extraReducers: (b) => {
    b.addCase(searchRecipes.pending, (s, a) => {
      s.loading = true;
      s.error = null;
      s.searchMode = true;

      const {
        title = '',
        category = '',
        ingredient = '',
        page = 1,
      } = a.meta.arg || {};

      s.query = { title, category, ingredient };

      // новая первая страница поиска — очищаем
      if (page === 1) {
        s.items = [];
        s.page = 1;
      }
    })
      .addCase(searchRecipes.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.page = payload.page;
        s.perPage = payload.perPage ?? 12;
        s.totalItems = payload.totalItems ?? payload.total ?? 0;
        s.totalPages = payload.totalPages ?? 0;

        // КЛЮЧЕВОЕ: показываем только текущую страницу (12 шт.)
        s.items = payload.recipes || [];
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
