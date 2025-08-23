import { configureStore } from '@reduxjs/toolkit';
<<<<<<< HEAD
import userProfileReducer from './UserProfile/slice';
import authReducer from './auth/slice';
=======
import authReducer from './auth/slice.js';
import modalReducer from './modal/slice.js';
>>>>>>> 2103859997623afaa7da1b62a5f8314ba04bfeec

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    auth: authReducer,
    modal: modalReducer,
  },
});
