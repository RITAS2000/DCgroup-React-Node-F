// src/components/UserProfile/RecipeCard/RecipeCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, deleteFavorite, addFavorite } from '../../api/recipes';
import s from './RecipeCard.module.css';
import { ReactComponent as FavorIcon } from '../../images/svg/favor.svg';
import { ReactComponent as ClockIcon } from '../../images/svg/clock.svg';

export default function RecipeCard({
  item,
  mode = 'own', // 'own' | 'favorites'
  onRemoved, // колбек після видалення з обраного
  onRemovedError, // колбек помилки
}) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  const {
    title,
    name,
    description,
    thumb,
    photo,
    cals,
    calories,
    time,
    id,
    _id,
  } = item || {};

  const recipeId = id || _id;
  const heading = title || name || 'Recipe';
  const desc = description || '';
  const rawImg = photo || thumb || '';
  const img = getImageUrl(rawImg);
  const token = localStorage.getItem('accessToken') ?? '';

  // у списку "favorites" — вже збережений
  const [isSaved, setIsSaved] = useState(mode === 'favorites');

  async function toggleSave(id) {
    if (!token || !id || pending) return;
    try {
      setPending(true);
      if (isSaved) {
        await deleteFavorite(id, token);
        setIsSaved(false);
        // якщо ми на сторінці "favorites" — видаляємо картку із списку
        if (mode === 'favorites') {
          if (typeof onRemoved === 'function') onRemoved(id);
          else
            window.dispatchEvent(
              new CustomEvent('recipe:removed', { detail: { id } }),
            );
        }
      } else {
        await addFavorite(id, token);
        setIsSaved(true);
      }
    } catch (err) {
      if (typeof onRemovedError === 'function') onRemovedError(id, err);
      console.error('Failed to toggle favorite', err);
      alert('Operation failed. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <article className={s.card}>
      {/* тільки картинка у шапці */}
      <div className={s.thumbWrap}>
        {img ? (
          <img
            className={s.thumb}
            src={img}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = getImageUrl('/images/placeholder.png');
            }}
          />
        ) : (
          <div className={s.thumbFallback} aria-label="No image available" />
        )}
      </div>

      {/* заголовок + бейдж часу праворуч */}
      <div className={s.headerRow}>
        <h3 className={s.title} title={heading}>
          {heading}
        </h3>

        {!!time && (
          <span className={s.timeBadge} title={`${time} min`}>
            <ClockIcon className={s.clockIcon} />
            {time}
          </span>
        )}
      </div>

      {desc ? (
        <p className={s.desc}>{desc}</p>
      ) : (
        <p className={s.desc}>&nbsp;</p>
      )}

      {/* низ картки: калорії зліва, справа — Learn more + закладка */}
      <div className={s.footerRow}>
        {typeof (cals ?? calories) === 'number' ? (
          <span className={s.calsPill}>~{cals ?? calories} cals</span>
        ) : (
          <span />
        )}

        <div className={s.actions}>
          <button
            className={s.moreBtn}
            type="button"
            onClick={() => recipeId && navigate(`/recipes/${recipeId}`)}
            disabled={!recipeId}
          >
            Learn more
          </button>

          <button
            type="button"
            className={`${s.favBtn} ${isSaved ? s.favBtnActive : ''}`}
            onClick={() => toggleSave(recipeId)}
            aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
          >
            <FavorIcon />
          </button>
        </div>
      </div>
    </article>
  );
}
