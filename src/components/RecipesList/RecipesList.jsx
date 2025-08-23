import { useState } from 'react';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn.jsx';
import RecipeCard from '../RecipeCard/RecipeCard.jsx';
import css from './RecipesList.module.css';

import recipes from './recipes.json';

export default function RecipesList() {
  const [card, setCard] = useState(12);

  const handleLoadMore = () => {
    setCard((prev) => prev + 12);
  };
  return (
    <div className={css.recipe_container}>
      <ul className={css.recipe_list}>
        {recipes
          .slice(0, card)
          .map(({ _id, thumb, title, time, description, calories }) => (
            <li key={_id}>
              <RecipeCard
                thumb={thumb}
                title={title}
                time={time}
                description={description}
                calories={calories}
              />
            </li>
          ))}
      </ul>
      {card < recipes.length && <LoadMoreBtn onClick={handleLoadMore} />}
    </div>
  );
}
