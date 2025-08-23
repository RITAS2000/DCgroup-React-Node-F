import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch, PAGE_SIZE } from '../../../api/recipes';
import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import s from './RecipesList.module.css';

export default function RecipesList({ type }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const hasMore = page < totalPages;
  const token = localStorage.getItem('accessToken') || '';
  const isPrivate = type === 'own' || type === 'favorites';

  const reqIdRef = useRef(0);
  const abortRef = useRef(null);

  const loadPage = useCallback(
    async (nextPage, replace = false) => {
      if (!nextPage || loading) return;
      if (isPrivate && !token) return;

      setLoading(true);
      setErr('');
      const myReqId = ++reqIdRef.current;

      // скасовуємо попередній запит
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const path =
          type === 'own' ? '/api/recipes/own' : '/api/recipes/saved-recipes';

        const data = await apiFetch(path, {
          page: nextPage,
          limit: PAGE_SIZE,
          token,
          signal: ctrl.signal,
        });

        const box = data?.data ?? data;
        const payload = box?.data ?? box?.recipes ?? box?.items ?? [];
        const totalItems =
          (typeof box?.totalItems === 'number' && box.totalItems) ??
          (typeof box?.data?.totalItems === 'number' && box.data.totalItems) ??
          undefined;

        const tp =
          (typeof box?.totalPages === 'number' && box.totalPages) ||
          (typeof box?.data?.totalPages === 'number' && box.data.totalPages) ||
          (typeof totalItems === 'number'
            ? Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
            : 1);

        // ігноруємо застарілу відповідь
        if (reqIdRef.current !== myReqId) return;

        setItems((prev) => {
          const merged = replace ? payload : [...prev, ...payload];
          const seen = new Set();
          return merged.filter((it) => {
            const key = String(it.id ?? it._id ?? '');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        });

        setPage(nextPage);
        setTotalPages(tp);
      } catch (e) {
        if (e?.name !== 'AbortError') setErr(e?.message || 'Failed to load');
      } finally {
        if (reqIdRef.current === myReqId) {
          setLoading(false);
          abortRef.current = null;
        }
      }
    },
    [loading, isPrivate, token, type],
  );

  useEffect(() => {
    // скидаємо стан при зміні типу або токена
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setErr('');

    if (isPrivate && !token) return; // гість — не вантажимо приватні дані
    void loadPage(1, true);

    return () => abortRef.current?.abort();
  }, [type, token, isPrivate, loadPage]);

  useEffect(() => {
    function onRemoved(e) {
      const id = e?.detail?.id;
      if (!id) return;
      setItems((prev) =>
        prev.filter((x) => String(x.id || x._id) !== String(id)),
      );
    }
    window.addEventListener('recipe:removed', onRemoved);
    return () => window.removeEventListener('recipe:removed', onRemoved);
  }, []);

  return (
    <>
      {err && <div className={s.error}>⚠ {err}</div>}

      {!token && isPrivate ? (
        <div className={s.empty}>Please log in to see your recipes.</div>
      ) : (
        <>
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

            {loading &&
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={`sk-${i}`} className={`${s.card} ${s.skeleton}`} />
              ))}
          </div>

          {!loading && items.length === 0 && !err && (
            <div className={s.empty}>No recipes yet.</div>
          )}

          {hasMore && !err && (!isPrivate || token) && (
            <LoadMoreBtn onClick={() => loadPage(page + 1)} />
          )}
        </>
      )}
    </>
  );
}
