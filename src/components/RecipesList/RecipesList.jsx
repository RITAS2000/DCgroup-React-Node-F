import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn.jsx';
import RecipeCard from '../RecipeCard/RecipeCard.jsx';
import css from './RecipesList.module.css';

axios.defaults.baseURL = 'https://dcgroup-react-node-b.onrender.com/';

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [card, setCard] = useState(12);
  const lastCardRef = useRef(null);
  const scrollAfterLoad = useRef(false);

  const handleLoadMore = () => {
    scrollAfterLoad.current = true;
    setCard((prev) => prev + 12);
  };
  //отримуємо з бекенда всі картки рецептів
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('api/recipes/search');
        const recipesArray = response.data?.data?.data || [];
        // console.log('довжина', recipesArray);
        setRecipes(recipesArray);
      } catch (error) {
        console.error('Помилка при завантаженні рецептів:', error);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (scrollAfterLoad.current && lastCardRef.current) {
      lastCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      scrollAfterLoad.current = false;
    }
  }, [card]);

  return (
    <div className={css.recipe_container}>
      <ul className={css.recipe_list}>
        {recipes
          .slice(0, card)
          .map(({ _id, thumb, title, time, description, calory }, index) => {
            const isLastNew = index === card - 12; // перший новий елемент після "Load More"
            return (
              <li
                className={css.recipe_item}
                key={_id}
                ref={isLastNew ? lastCardRef : null}
              >
                <RecipeCard
                  thumb={thumb}
                  title={title}
                  time={time}
                  description={description}
                  calories={calory}
                />
              </li>
            );
          })}
      </ul>

      {recipes.length > card && <LoadMoreBtn onClick={handleLoadMore} />}
      {/* <LoadMoreBtn onClick={handleLoadMore} /> */}
    </div>
  );
}
