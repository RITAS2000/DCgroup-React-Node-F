import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch, PAGE_SIZE, getImageUrl } from '../../api/recipes';
import s from './ProfilePage.module.css';

function RecipeCard({ item }) {
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
  } = item;
  const rawImg = photo || recipeImg || thumb || '';
  const img = getImageUrl(rawImg);

  const heading = name || title || 'Recipe';
  const desc = decr || description;
  const navigate = useNavigate();
  const recipeId = item.id || item._id;

  return (
    <article className={s.card}>
      <div className={s.thumbWrap}>
        {img ? (
          <img className={s.thumb} src={img} alt={heading} loading="lazy" />
        ) : (
          <div className={s.thumbFallback} aria-hidden />
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
        <button
          className={s.moreBtn}
          type="button"
          onClick={() => recipeId && navigate(`/recipes/${recipeId}`)}
        >
          Learn more
        </button>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className={`${s.card} ${s.skeleton}`}>
      <div className={s.thumbWrap} />
      <div className={s.line} />
      <div className={s.lineSm} />
      <div className={s.meta} />
    </div>
  );
}

export default function ProfilePage() {
  const { recipeType = 'own' } = useParams();
  const navigate = useNavigate();
  const tab = recipeType === 'favorites' ? 'saved' : 'own';

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const token = localStorage.getItem('accessToken') || '';
  const hasMore = page < totalPages;

  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setErr('');
    void loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, token]);

  async function loadPage(nextPage = page + 1, replace = false) {
    setLoading(true);
    setErr('');
    try {
      const path =
        tab === 'own' ? '/api/recipes/own' : '/api/recipes/saved-recipes';
      const data = await apiFetch(path, {
        page: nextPage,
        limit: PAGE_SIZE,
        token,
      });

      const box = data?.data ?? data;
      const payload = box?.data ?? box?.recipes ?? box?.items ?? [];

      let tp = 1;
      if (typeof box?.totalPages === 'number') {
        tp = box.totalPages;
      } else if (typeof box?.data?.totalPages === 'number') {
        tp = box.data.totalPages;
      } else {
        const totalItems =
          (typeof box?.totalItems === 'number' ? box.totalItems : undefined) ??
          (typeof box?.data?.totalItems === 'number'
            ? box.data.totalItems
            : undefined) ??
          payload.length ??
          0;
        tp = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
      }

      setItems((prev) => (replace ? payload : [...prev, ...payload]));
      setPage(nextPage);
      setTotalPages(tp);
    } catch (e) {
      setErr(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.wrap}>
      <header className={s.header}>
        <h1 className={s.h1}>My profile</h1>
        <nav className={s.tabs} role="tablist" aria-label="Recipe lists">
          <button
            role="tab"
            aria-selected={tab === 'own' ? 'true' : 'false'}
            className={`${s.tabBtn} ${tab === 'own' ? s.active : ''}`}
            onClick={() => navigate('/user-profile/own')}
            type="button"
          >
            My Recipes
          </button>
          <button
            role="tab"
            aria-selected={tab === 'saved' ? 'true' : 'false'}
            className={`${s.tabBtn} ${tab === 'saved' ? s.active : ''}`}
            onClick={() => navigate('/user-profile/favorites')}
            type="button"
          >
            Saved Recipes
          </button>
        </nav>
      </header>

      {err && <div className={s.error}>⚠ {err}</div>}

      <div className={s.grid}>
        {items.map((it) => (
          <RecipeCard key={String(it.id || it._id)} item={it} />
        ))}
        {loading &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
      </div>

      {!loading && items.length === 0 && !err && (
        <div className={s.empty}>
          <p>No recipes yet.</p>
        </div>
      )}

      {hasMore && (
        <div className={s.actions}>
          <button
            className={s.loadMore}
            type="button"
            onClick={() => loadPage(page + 1)}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Load More'}
          </button>
        </div>
      )}
    </section>
  );
}
