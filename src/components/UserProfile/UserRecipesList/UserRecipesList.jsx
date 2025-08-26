import { useEffect, useRef, useState } from 'react';
import {
  PAGE_SIZE,
  getOwnRecipes,
  getSavedRecipes,
} from '../../../api/recipes.js';
import UserRecipeCard from '../UserRecipeCard/UserRecipeCard.jsx';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn.jsx';
import s from './UserRecipesList.module.css';

export default function UserRecipesList({ type }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [authVer, bumpAuthVer] = useState(0);

  const reqIdRef = useRef(0);
  const abortRef = useRef(null);

  const isPrivate = type === 'own' || type === 'favorites';
  const hasMore = page < totalPages;

  const isTokenExpired = (msg = '') => /access token expired/i.test(msg);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setErr('');

    const token = localStorage.getItem('accessToken') || '';
    if (isPrivate && !token) return;

    void loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, authVer]);

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
    const token = localStorage.getItem('accessToken') || '';
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

      const list = Array.isArray(res.items)
        ? res.items
        : Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.recipes)
        ? res.recipes
        : [];

      setItems((prev) => {
        const merged = replace ? list : [...prev, ...list];
        const seen = new Set();
        return merged.filter((it) => {
          const key = String(it?.id ?? it?._id ?? '');
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });

      const tp =
        typeof res.totalPages === 'number' && res.totalPages > 0
          ? res.totalPages
          : Math.max(
              1,
              Math.ceil(
                (replace ? list.length : items.length + list.length) /
                  PAGE_SIZE,
              ),
            );

      setPage(nextPage);
      setTotalPages(tp);
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

      <div className={s.recipe_container}>
        <ul className={s.recipe_list}>
          {items.map((it) => (
            <li className={s.recipe_item} key={String(it.id ?? it._id)}>
              <UserRecipeCard
                item={it}
                mode={type === 'own' ? 'own' : 'favorites'}
                onRemoved={(id) =>
                  setItems((prev) =>
                    prev.filter((x) => String(x.id ?? x._id) !== String(id)),
                  )
                }
              />
            </li>
          ))}

          {loading &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <li key={`sk-${i}`} className={s.recipe_item}>
                <div className={s.skCard}>
                  <div className={s.skThumb} />
                  <div className={s.skLine} />
                  <div className={s.skLineSm} />
                  <div className={s.skLineSm} />
                </div>
              </li>
            ))}
        </ul>
      </div>

      {!localStorage.getItem('accessToken') && isPrivate ? (
        <div className={s.empty}>Please log in to see your recipes.</div>
      ) : (
        !loading &&
        items.length === 0 &&
        !err && <div className={s.empty}>No recipes yet.</div>
      )}

      {hasMore &&
        !err &&
        (!!localStorage.getItem('accessToken') || !isPrivate) && (
          <LoadMoreBtn
            onClick={() => loadPage(page + 1)}
            disabled={loading}
            loading={loading}
          />
        )}
    </>
  );
}
