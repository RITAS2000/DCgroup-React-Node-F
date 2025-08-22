import { getImageUrl, deleteFavorite } from '../../api/recipes';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './RecipeCard.module.css';

export default function RecipeCard({ item, mode }) {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem('accessToken') || '', []);
  const {
    title,
    name,
    description,
    decr,
    thumb,
    recipeImg,
    photo,
    cals,
    time,
    _id,
    id,
  } = item;

  const rawImg = photo || recipeImg || thumb || '';
  const img = getImageUrl(rawImg);
  const heading = name || title || 'Recipe';
  const desc = decr || description;
  const recipeId = id || _id;

  async function onDelete() {
    try {
      await deleteFavorite(recipeId, token);
      const ev = new CustomEvent('recipe:removed', {
        detail: { id: recipeId },
      });
      window.dispatchEvent(ev);
    } catch {
      alert('Failed to remove from favorites');
    }
  }

  return (
    <article className={s.card}>
      <div className={s.thumbWrap}>
        {img ? (
          <img className={s.thumb} src={img} alt={heading} loading="lazy" />
        ) : (
          <div className={s.thumbFallback} />
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
            aria-label="Remove from favorites"
          >
            {/* тут твій svg */}
            Remove
          </button>
        ) : (
          <button
            className={s.moreBtn}
            type="button"
            onClick={() => navigate(`/recipes/${recipeId}`)}
          >
            Learn more
          </button>
        )}
      </div>
    </article>
  );
}
