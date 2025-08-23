import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('accessToken') || '',
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload || '';
      localStorage.setItem('accessToken', state.token);
    },
    clearToken: (state) => {
      state.token = '';
      localStorage.removeItem('accessToken');
    },
    setLoading: (state, action) => {
      state.loading = !!action.payload;
    },
  },
});

export const { setToken, clearToken, setLoading } = authSlice.actions;
export default authSlice.reducer;
