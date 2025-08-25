export const selectRecipes = (s) => s.recipes.items;
export const selectRecipesLoading = (s) => s.recipes.loading;
export const selectRecipesError = (s) => s.recipes.error;
export const selectRecipesPage = (s) => s.recipes.page;
export const selectRecipesTotalPages = (s) => s.recipes.totalPages;
export const selectSearchMode = (s) => s.recipes.searchMode;
export const selectLastQuery = (s) => s.recipes.lastQuery; // 🟢 додав
export const selectTotalItems = (s) => s.recipes.totalItems; // 🟢 для NoResultSearch
