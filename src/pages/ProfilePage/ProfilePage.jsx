// src/components/pages/ProfilePage/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE, PAGE_SIZE, getImageUrl } from '../../api/recipes';
import s from './ProfilePage.module.css';

async function safeJson(res) {
  const text = await res.text().catch(() => '');
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { _raw: text };
  }
}

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
  } = item || {};
  const img = getImageUrl(photo || recipeImg || thumb || '');
  const heading = name || title || 'Recipe';
  const navigate = useNavigate();
  const recipeId = item?.id || item?._id;

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
      {(decr || description) && <p className={s.desc}>{decr || description}</p>}
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

  // DEV автологін (вимикається якщо прапор не true)
  useEffect(() => {
    async function devAutoLogin() {
      if (token) return;
      if (import.meta.env.VITE_DEV_FORCE_AUTH !== 'true') return;
      const email = import.meta.env.VITE_DEV_EMAIL;
      const password = import.meta.env.VITE_DEV_PASSWORD;
      if (!email || !password) return;

      try {
        const r = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const j = await safeJson(r);
        const t = j?.data?.accessToken || j?.accessToken || j?.token || '';
        if (r.ok && t) {
          localStorage.setItem('accessToken', t);
          location.reload();
        }
      } catch {
        console.log();
      }
    }
    devAutoLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setErr('');
    if (!token) return;
    void loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, token]);

  // Єдиний клієнт GET: завжди використовує perPage (бек цього інстансу читає саме його)
  async function baseRequest(path, { page = 1, perPage = PAGE_SIZE } = {}) {
    const url = new URL(`${API_BASE}${path}`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('perPage', String(perPage)); // <- ключова правка
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url.toString(), { headers });
    const data = await safeJson(res);

    if (!res.ok) {
      // спеціально для 401 — чистимо токен, щоб показати "Please log in..."
      if (res.status === 401) localStorage.removeItem('accessToken');
      throw new Error(data?.message || res.statusText || 'Request failed');
    }
    return data;
  }

  async function loadPage(nextPage = page + 1, replace = false) {
    if (!token) return;
    setLoading(true);
    setErr('');
    try {
      const path =
        tab === 'own' ? '/api/recipes/own' : '/api/recipes/saved-recipes';
      const payload = await baseRequest(path, {
        page: nextPage,
        perPage: PAGE_SIZE,
      });

      const box = payload?.data ?? payload;
      const list = box?.data ?? box?.recipes ?? box?.items ?? [];
      const tp =
        box?.totalPages ??
        payload?.totalPages ??
        Math.max(1, Math.ceil((box?.totalItems ?? list.length) / PAGE_SIZE));

      setItems((prev) => (replace ? list : [...prev, ...list]));
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

      {!token && (
        <div className={s.empty}>
          <p>Please log in to see your recipes.</p>
        </div>
      )}

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

      {token && !loading && items.length === 0 && !err && (
        <div className={s.empty}>
          <p>No recipes yet.</p>
        </div>
      )}

      {token && hasMore && !err && (
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
