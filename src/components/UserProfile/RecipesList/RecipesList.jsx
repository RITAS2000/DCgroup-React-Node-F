import { useEffect, useRef, useState } from 'react';
import {
  PAGE_SIZE,
  getOwnRecipes,
  getSavedRecipes,
} from '../../../api/recipes';
// щоб точно підтягнути правильний компонент
import RecipeCard from '../RecipeCard/RecipeCard.jsx';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import s from './RecipesList.module.css';

export default function RecipesList({ type }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [authVer, bumpAuthVer] = useState(0);

  const token = localStorage.getItem('accessToken') || '';
  const isPrivate = type === 'own' || type === 'favorites';
  const hasMore = page < totalPages;

  const reqIdRef = useRef(0);
  const abortRef = useRef(null);

  const isTokenExpired = (msg = '') => /access token expired/i.test(msg);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setErr('');

    if (isPrivate && !token) return;
    void loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, token, authVer]);

  useEffect(() => {
    function onRemoved(e) {
      const id = e?.detail?.id;
      if (!id) return;
      setItems((prev) =>
        prev.filter((x) => String(x.id || x._id) !== String(id)),
      );
    }
    window.addEventListener('recipe:removed', onRemoved);
    return () => {
      window.removeEventListener('recipe:removed', onRemoved);
      abortRef.current?.abort();
    };
  }, []);

  async function loadPage(nextPage, replace = false) {
    if (!nextPage || loading) return;
    if (isPrivate && !token) return;

    setLoading(true);
    setErr('');
    const myReqId = ++reqIdRef.current;

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res =
        type === 'own'
          ? await getOwnRecipes({
              page: nextPage,
              limit: PAGE_SIZE,
              token,
              signal: ctrl.signal,
            })
          : await getSavedRecipes({
              page: nextPage,
              perPage: PAGE_SIZE,
              token,
              signal: ctrl.signal,
            });

      if (reqIdRef.current !== myReqId) return;

      setItems((prev) => {
        const merged = replace ? res.items : [...prev, ...res.items];
        const seen = new Set();
        return merged.filter((it) => {
          const key = String(it?.id ?? it?._id ?? '');
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });

      setPage(nextPage);
      setTotalPages(
        typeof res.totalPages === 'number' && res.totalPages > 0
          ? res.totalPages
          : Math.max(
              1,
              Math.ceil(
                (replace
                  ? res.items?.length || 0
                  : items.length + (res.items?.length || 0)) / PAGE_SIZE,
              ),
            ),
      );
    } catch (e) {
      const msg = e?.message || '';
      if (isTokenExpired(msg) || e?.status === 401) {
        localStorage.removeItem('accessToken');
        setItems([]);
        setErr('');
        bumpAuthVer((v) => v + 1);
      } else if (e?.name !== 'AbortError') {
        setErr(msg || 'Failed to load');
      }
    } finally {
      if (reqIdRef.current === myReqId) {
        setLoading(false);
        abortRef.current = null;
      }
    }
  }

  return (
    <>
      {err && !/access token expired/i.test(err) && (
        <div className={s.error}>⚠ {err}</div>
      )}

      <div className={s.grid}>
        {items.map((it) => (
          <RecipeCard
            key={String(it.id ?? it._id)}
            item={it}
            mode={type === 'own' ? 'own' : 'favorites'}
            onRemoved={(id) =>
              setItems((prev) =>
                prev.filter((x) => String(x.id ?? x._id) !== String(id)),
              )
            }
          />
        ))}

        {/* Скелетони з правильними класами */}
        {loading &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={`sk-${i}`} className={s.skCard}>
              <div className={s.skThumb} />
              <div className={s.skLine} />
              <div className={s.skLineSm} />
              <div className={s.skLineSm} />
            </div>
          ))}
      </div>

      {!token && isPrivate ? (
        <div className={s.empty}>Please log in to see your recipes.</div>
      ) : (
        !loading &&
        items.length === 0 &&
        !err && <div className={s.empty}>No recipes yet.</div>
      )}

      {hasMore && !err && (!!token || !isPrivate) && (
        <LoadMoreBtn
          onClick={() => loadPage(page + 1)}
          disabled={loading}
          loading={loading}
        />
      )}
    </>
  );
}
