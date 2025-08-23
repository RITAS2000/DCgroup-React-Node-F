import { useEffect, useState, useRef } from 'react';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn.jsx';
import RecipeCard from '../RecipeCard/RecipeCard.jsx';
import css from './RecipesList.module.css';

import recipes from './recipes.json';

export default function RecipesList() {
  const [card, setCard] = useState(12);
  const lastCardRef = useRef(null);
  const scrollAfterLoad = useRef(false);

  const handleLoadMore = () => {
    scrollAfterLoad.current = true;
    setCard((prev) => prev + 12);
    
  };

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
        {recipes.slice(0, card).map(({ _id, thumb, title, time, description, calories }, index) => {
          const isLastNew = index === card - 12; // перший новий елемент після "Load More"
          return (
            <li className={css.recipe_item} key={_id} ref={isLastNew ? lastCardRef : null}>
              <RecipeCard
                thumb={thumb}
                title={title}
                time={time}
                description={description}
                calories={calories}
              />
            </li>
          );
        })}
      </ul>

      {card < recipes.length && <LoadMoreBtn onClick={handleLoadMore} />}
    </div>
  );
}
