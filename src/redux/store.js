import { configureStore } from '@reduxjs/toolkit';
import userProfileReducer from './UserProfile/slice';
import authReducer from './auth/slice.js';
import modalReducer from './modal/slice.js';

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    auth: authReducer,
    modal: modalReducer,
  },
});
