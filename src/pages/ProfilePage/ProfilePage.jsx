import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import s from './ProfilePage.module.css';
import { getOwnRecipes, getSavedRecipes } from '../../api/recipes';

export default function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabIsOwn = location.pathname.startsWith('/profile/own');

  const [token, setToken] = useState(
    () => localStorage.getItem('accessToken') || '',
  );
  const [counts, setCounts] = useState({ own: null, saved: null });

  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'accessToken') {
        setToken(e.newValue || '');
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!token) {
      setCounts({ own: null, saved: null });
      return;
    }

    const fetchCount = async (kind) => {
      const box =
        kind === 'own'
          ? await getOwnRecipes({ page: 1, limit: 1, token })
          : await getSavedRecipes({ page: 1, perPage: 1, token });

      const total =
        box?.totalItems ??
        box?.total ??
        box?.totalCount ??
        box?.totalPages ??
        (Array.isArray(box?.items) ? box.items.length : 0);

      return typeof total === 'number' ? total : 0;
    };

    (async () => {
      try {
        const [own, saved] = await Promise.all([
          fetchCount('own'),
          fetchCount('saved'),
        ]);
        setCounts({ own, saved });
      } catch (e) {
        if (
          e?.status === 401 ||
          /access token expired/i.test(e?.message || '')
        ) {
          localStorage.removeItem('accessToken');
          setToken('');
        }
        setCounts({ own: null, saved: null });
      }
    })();
  }, [token]);

  const activeCount = useMemo(
    () => (tabIsOwn ? counts.own : counts.saved),
    [tabIsOwn, counts],
  );

  const countText = useMemo(() => {
    if (!token) return null;
    if (activeCount == null) return '…';
    return `${activeCount} recipe${activeCount === 1 ? '' : 's'}`;
  }, [token, activeCount]);

  return (
    <section className={s.wrap}>
      <header className={s.header}>
        <h1 className={s.h1}>My profile</h1>

        <nav className={s.tabs} role="tablist" aria-label="Recipe lists">
          <button
            role="tab"
            aria-selected={tabIsOwn ? 'true' : 'false'}
            className={`${s.tabBtn} ${tabIsOwn ? s.active : ''}`}
            onClick={() => navigate('/profile/own')}
            type="button"
          >
            My Recipes
          </button>
          <button
            role="tab"
            aria-selected={!tabIsOwn ? 'true' : 'false'}
            className={`${s.tabBtn} ${!tabIsOwn ? s.active : ''}`}
            onClick={() => navigate('/profile/favorites')}
            type="button"
          >
            Saved Recipes
          </button>
        </nav>

        {countText && <div className={s.countLine}>{countText}</div>}
      </header>

      <Outlet />
    </section>
  );
}
