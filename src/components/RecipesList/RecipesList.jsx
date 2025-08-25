import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn.jsx';
import RecipeCard from '../RecipeCard/RecipeCard.jsx';
import css from './RecipesList.module.css';
import {
  selectRecipes,
  selectRecipesLoading,
  selectRecipesError,
  selectSearchMode, // НОВОЕ
} from '../../redux/recipes/selectors';

// единый baseURL
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || 'https://dcgroup-react-node-b.onrender.com/';

export default function RecipesList() {
  // --- данные поиска из Redux ---
  const searched = useSelector(selectRecipes);
  const searchMode = useSelector(selectSearchMode);
  const searching = useSelector(selectRecipesLoading);
  const searchError = useSelector(selectRecipesError);

  // --- обычная лента (как у тебя было) ---
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const lastCardRef = useRef(null);
  const scrollAfterLoad = useRef(false);

  const fetchRecipes = async (pageNum) => {
    try {
      setLoadingFeed(true);
      const response = await axios.get('/api/recipes', {
        params: { page: pageNum, perPage: 12 },
      });
      const data = response.data?.data || {};
      const recipesArray = data.data || [];

      setRecipes((prev) => {
        const newRecipes = recipesArray.filter(
          (r) => !prev.some((p) => p._id === r._id),
        );
        return [...prev, ...newRecipes];
      });

      setHasNextPage(Boolean(data.hasNextPage));
    } catch (error) {
      console.error('Помилка при завантаженні рецептів:', error);
    } finally {
      setLoadingFeed(false);
    }
  };

  // грузим ленту только вне режима поиска
  useEffect(() => {
    if (!searchMode) {
      fetchRecipes(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchMode]);

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

  // если режим поиска — показываем ТОЛЬКО результаты поиска (или пустое состояние)
  if (searchMode) {
    if (searching) {
      return <div className={css.recipe_container}>Loading…</div>;
    }
    if (searchError) {
      return (
        <div className={css.recipe_container} style={{ color: 'crimson' }}>
          {String(searchError)}
        </div>
      );
    }
    if (!searched.length) {
      return <div className={css.recipe_container}>Nothing found</div>;
    }

    return (
      <div className={css.recipe_container}>
        <ul className={css.recipe_list}>
          {searched.map(({ _id, thumb, title, time, description, calory }) => (
            <li className={css.recipe_item} key={_id}>
              <RecipeCard
                thumb={thumb}
                title={title}
                time={time}
                description={description}
                calories={calory}
              />
            </li>
          ))}
        </ul>
        {/* В режиме поиска кнопки Load More нет */}
      </div>
    );
  }

  // иначе — обычная лента
  return (
    <div className={css.recipe_container}>
      <ul className={css.recipe_list}>
        {recipes.map(
          ({ _id, thumb, title, time, description, calory }, index) => {
            const isLastNew = index === recipes.length - 1;
            return (
              <li
                className={css.recipe_item}
                key={_id}
                ref={isLastNew ? lastCardRef : null}
              >
                <RecipeCard
                  id={_id}
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

      {recipes.length > 0 && !loadingFeed && hasNextPage && (
        <LoadMoreBtn onClick={handleLoadMore} />
      )}
    </div>
  );
}
// import { useEffect, useState, useRef } from 'react';
// import axios from 'axios';

// import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn.jsx';
// import RecipeCard from '../RecipeCard/RecipeCard.jsx';
// import css from './RecipesList.module.css';

// axios.defaults.baseURL = 'https://dcgroup-react-node-b.onrender.com/';

// export default function RecipesList() {
//   const [recipes, setRecipes] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const lastCardRef = useRef(null);
//   const scrollAfterLoad = useRef(false);

//   //отримуємо з бекенда всі картки рецептів
//   const fetchRecipes = async (page) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`api/recipes?page=${page}&perPage=12`);

//       const data = response.data?.data || {};
//       console.log('API response:', response.data);
//       const recipesArray = data.data || [];
//       setRecipes((prev) => {
//         const newRecipes = recipesArray.filter(
//           (r) => !prev.some((p) => p._id === r._id),
//         );
//         return [...prev, ...newRecipes];
//       }); // ось це фільтруе однаковий ади але в чому причина я незнайшла - подивись чому так я не знаю
//       // setRecipes((prev) => [...prev, ...recipesArray]); // додаємо нові до старих
//       setHasNextPage(data.hasNextPage);
//     } catch (error) {
//       console.error('Помилка при завантаженні рецептів:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecipes(page);
//   }, [page]);

//   const handleLoadMore = () => {
//     scrollAfterLoad.current = true;
//     setPage((prev) => prev + 1);
//   };

//   useEffect(() => {
//     if (scrollAfterLoad.current && lastCardRef.current) {
//       lastCardRef.current.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//       scrollAfterLoad.current = false;
//     }
//   }, [recipes]);

//   return (
//     <div className={css.recipe_container}>
//       <ul className={css.recipe_list}>
//         {recipes.map(
//           ({ _id, thumb, title, time, description, calory }, index) => {
//             const isLastNew = index === recipes.length - 1; // перший новий елемент після "Load More"
//             return (
//               <li
//                 className={css.recipe_item}
//                 key={_id}
//                 ref={isLastNew ? lastCardRef : null}
//               >
//                 <RecipeCard
//                   thumb={thumb}
//                   title={title}
//                   time={time}
//                   description={description}
//                   calories={calory}
//                 />
//               </li>
//             );
//           },
//         )}
//       </ul>

//       {recipes.length > 0 && !loading && hasNextPage && (
//         <LoadMoreBtn onClick={handleLoadMore} />
//       )}
//       {/* <LoadMoreBtn onClick={handleLoadMore} /> */}
//     </div>
//   );
// }
