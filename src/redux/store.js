import { configureStore } from '@reduxjs/toolkit';
import userProfileReducer from './UserProfile/slice';
import authReducer from './auth/slice.js';
import modalReducer from './modal/slice.js';
import addRecipeReducer from './addRecipe/sliceAddRecipe.js';
import recipesReducer from './recipes/slice.js';

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    auth: authReducer,
    modal: modalReducer,
    addRecipe: addRecipeReducer,
    recipes: recipesReducer,
  },
});
