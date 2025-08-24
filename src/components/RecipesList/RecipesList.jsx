import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn.jsx';
import RecipeCard from '../RecipeCard/RecipeCard.jsx';
import css from './RecipesList.module.css';

axios.defaults.baseURL = 'https://dcgroup-react-node-b.onrender.com/';

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const lastCardRef = useRef(null);
  const scrollAfterLoad = useRef(false);

  //отримуємо з бекенда всі картки рецептів
  const fetchRecipes = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`api/recipes?page=${page}&perPage=12`);
      const data = response.data?.data || {};
      const recipesArray = data.data || [];

      setRecipes((prev) => [...prev, ...recipesArray]); // додаємо нові до старих
      setHasNextPage(data.hasNextPage);
    } catch (error) {
      console.error('Помилка при завантаженні рецептів:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);

  const handleLoadMore = () => {
    scrollAfterLoad.current = true;
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (scrollAfterLoad.current && lastCardRef.current) {
      lastCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      scrollAfterLoad.current = false;
    }
  }, [recipes]);

  return (
    <div className={css.recipe_container}>
      <ul className={css.recipe_list}>
        {recipes.map(
          ({ _id, thumb, title, time, description, calory }, index) => {
            const isLastNew = index === recipes.length - 1; // перший новий елемент після "Load More"
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
          },
        )}
      </ul>

      {recipes.length > 0 && !loading && hasNextPage && (
        <LoadMoreBtn onClick={handleLoadMore} />
      )}
      {/* <LoadMoreBtn onClick={handleLoadMore} /> */}
    </div>
  );
}
