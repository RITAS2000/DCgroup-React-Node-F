import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, deleteFavorite } from '../../api/recipes';
import s from './RecipeCard.module.css';

export default function RecipeCard({
  item,
  mode = 'own',
  onRemoved,
  onRemovedError,
}) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  const { title, name, description, thumb, photo, cals, time, id, _id } =
    item || {};

  const recipeId = id || _id;
  const heading = title || name || 'Recipe';
  const desc = description || '';
  const rawImg = photo || thumb || '';
  const img = getImageUrl(rawImg);
  const token = localStorage.getItem('accessToken') ?? '';

  async function onDelete() {
    if (!recipeId || pending) return;
    try {
      setPending(true);
      await deleteFavorite(recipeId, token);
      if (typeof onRemoved === 'function') {
        onRemoved(recipeId);
      }
    } catch (e) {
      if (typeof onRemovedError === 'function') {
        onRemovedError(recipeId, e);
      } else {
        alert('Failed to remove from favorites');
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <article className={s.card}>
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
        {typeof cals === 'number' && (
          <span className={s.badge}>{cals} cals</span>
        )}
      </div>

      <h3 className={s.title} title={heading}>
        {heading}
      </h3>

      {desc && <p className={s.desc}>{desc}</p>}

      <div className={s.meta}>
        {time ? <span className={s.metaPill}>{time} min</span> : <span />}

        {mode === 'favorites' ? (
          <button
            className={s.deleteBtn}
            type="button"
            onClick={onDelete}
            disabled={pending || !recipeId}
            aria-label="Remove from favorites"
            aria-busy={pending ? 'true' : 'false'}
          >
            {/* svg іконка видалення */}
            {pending ? 'Removing…' : 'Remove'}
          </button>
        ) : (
          <button
            className={s.moreBtn}
            type="button"
            onClick={() => recipeId && navigate(`/recipes/${recipeId}`)}
            disabled={!recipeId}
          >
            Learn more
          </button>
        )}
      </div>
    </article>
  );
}
