import { useEffect, useMemo, useState } from 'react';
import { apiFetch, PAGE_SIZE } from '../../api/recipes';
import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import s from './RecipesList.module.css';

export default function RecipesList({ type }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const token = useMemo(() => localStorage.getItem('accessToken') || '', []);
  const hasMore = page < totalPages;

  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setErr('');
    void loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  async function loadPage(nextPage = page + 1, replace = false) {
    setLoading(true);
    setErr('');
    try {
      const path =
        type === 'own' ? '/api/recipes/own' : '/api/recipes/saved-recipes';
      const data = await apiFetch(path, {
        page: nextPage,
        limit: PAGE_SIZE,
        token,
      });

      const box = data?.data ?? data;
      const payload = box?.data ?? box?.recipes ?? box?.items ?? [];

      let tp = 1;
      if (typeof box?.totalPages === 'number') tp = box.totalPages;
      else if (typeof box?.data?.totalPages === 'number')
        tp = box.data.totalPages;
      else {
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
    <>
      {err && <div className={s.error}>⚠ {err}</div>}
      <div className={s.grid}>
        {items.map((it) => (
          <RecipeCard
            key={String(it.id || it._id)}
            item={it}
            mode={type === 'own' ? 'own' : 'favorites'}
          />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`sk-${i}`} className={`${s.card} ${s.skeleton}`} />
          ))}
      </div>

      {!loading && items.length === 0 && !err && (
        <div className={s.empty}>No recipes yet.</div>
      )}

      {hasMore && (
        <LoadMoreBtn
          onClick={() => loadPage(page + 1)}
          disabled={loading}
          loading={loading}
        />
      )}
    </>
  );
}
