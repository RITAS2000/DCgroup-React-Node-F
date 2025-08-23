
// import { useDispatch, useSelector } from "react-redux";

// import { useEffect } from "react";

import { useEffect, useState } from "react";
import RecipeDetails from "../../components/RecipeDetails/RecipeDetails.jsx";
import { useParams } from "react-router-dom";
import { getRecipeDetails } from "../../services/viewRecipeService.js";
import NotFoundPage from "../NotFoundPage/NotFoundPage.jsx";
import Container from "../../components/Container/Container.jsx";
export default function RecipeViewPage () {

    const { recipeId } = useParams();
    const [recipeDetails, setRecipeDetails] = useState(null);


    useEffect(() => {
      getRecipeDetails(recipeId)
        .then((data) => setRecipeDetails(data.data))
        .catch((error) => console.error(error));
    }, [recipeId]);

    return (
        <>
          {
            recipeDetails ? (
              <Container variant="light">
                <RecipeDetails details={recipeDetails}/>
              </Container>
            ) : (
              <NotFoundPage />
            )
          }
        </>
    )
}