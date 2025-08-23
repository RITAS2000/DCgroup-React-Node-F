import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slice.js';
import modalReducer from './modal/slice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
  },
});
