import { configureStore } from '@reduxjs/toolkit';
import userProfileReducer from './UserProfile/slice';
import authReducer from './auth/slice';

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    auth: authReducer,
  },
});
