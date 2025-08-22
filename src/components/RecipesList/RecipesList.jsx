import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn.jsx';
import RecipeCard from '../RecipeCard/RecipeCard.jsx';

import recipes from './recipes.json';

export default function RecipesList() {
  return (
    <div>
      <ul>
        {recipes.map(({ _id, thumb, title, time, description, calories }) => (
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

      <LoadMoreBtn />
    </div>
  );
}
