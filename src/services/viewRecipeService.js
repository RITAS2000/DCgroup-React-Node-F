import axios from 'axios';


axios.defaults.baseURL = "http://localhost:3000";


export const getRecipeDetails = async (recipeId) => {

    const res = await axios.get(
        `/api/recipes/${recipeId}`,
    );
    return res.data;
};

export const getSavedRecipes = async () => {
    const res = await axios.get(
        `/api/recipes/saved-recipes`,
    );
    return res.data;
}


export const postSavedRecipes = async (recipeId) => {
    const res = await axios.post(
      '/api/recipes/saved-recipes',
      { recipeId }
    );
    return res.data;
};


export const delSavedRecipes = async (recipeId) => {
    const res = await axios.delete(
        `/api/recipes/saved-recipes/${recipeId}`,
    );
    return res.data;
}


