import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../CategorySelect/CategorySelect.jsx';
import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
import { searchRecipes } from '../../redux/recipes/operations.js';
import css from './Filters.module.css';

const SPRITE = '/sprite/symbol-defs.svg';

const Filters = ({ title }) => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false); // панель селектов сворачивается/разворачивается

  // берем текущие значения из стора
  const query = useSelector((s) => s.recipes.query); // { title, category, ingredient }
  const totalItems = useSelector((s) => s.recipes.totalItems); // общее количество найденных рецептов
  const itemsLen = useSelector((s) => s.recipes.items?.length) || 0; // запасной вариант
  const total = totalItems || itemsLen;

  useEffect(() => {
    const queryTitle = (title ?? query?.title ?? '').trim();

    // если нет ни текста поиска, ни выбранных фильтров — не запускаем поиск
    if (!queryTitle && !selectedCategory && !selectedIngredient) return;

    dispatch(
      searchRecipes({
        title: queryTitle,
        category: selectedCategory,
        ingredient: selectedIngredient,
        page: 1, // при изменении фильтров всегда запрашиваем с первой страницы
      }),
    );
  }, [title, query?.title, selectedCategory, selectedIngredient, dispatch]);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
    // title по ТЗ не трогаем
  };

  const headingTitle = (title ?? query?.title ?? '').trim();

  return (
    <div className={css.filtersWrapper}>
      <div className={css.topRow}>
        <h2>
          {headingTitle ? `Search recipes for "${headingTitle}"` : 'Recepies'}
        </h2>
      </div>

      <div className={css.bottomRow}>
        <span className={css.count}>
          {total} recipe{total !== 1 ? 's' : ''}
        </span>

        <button
          type="button"
          className={css.filtersBtn}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span>Filters</span>
          <svg className={css.icon} aria-hidden="true">
            <use href={`${SPRITE}#icon-filter`} />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={css.panel}>
          <button className={css.resetButton} onClick={handleReset}>
            Reset filters
          </button>

          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />

          <IngredientsSelect
            selectedIngredient={selectedIngredient}
            onChange={setSelectedIngredient}
          />
        </div>
      )}
    </div>
  );
};

export default Filters;
