import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { API_BASE } from '../../api/recipes';
import s from './ProfilePage.module.css';

async function safeJson(res) {
  const text = await res.text().catch(() => '');
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { _raw: text };
  }
}

export default function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tabIsOwn = location.pathname.startsWith('/profile/own');

  const [counts, setCounts] = useState({ own: null, saved: null });

  async function fetchCount(kind) {
    const path =
      kind === 'own' ? '/api/recipes/own' : '/api/recipes/saved-recipes';

    const url = new URL(`${API_BASE}${path}`);
    url.searchParams.set('page', '1');
    if (kind === 'own') {
      url.searchParams.set('limit', '1');
    } else {
      url.searchParams.set('perPage', '1');
    }

    const token = localStorage.getItem('accessToken') || '';
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || 'Failed to load');

    const box = data?.data ?? data;
    const total =
      box?.totalPages ??
      box?.totalItems ??
      box?.total ??
      box?.totalCount ??
      (Array.isArray(box?.items) ? box.items.length : 0);

    return typeof total === 'number' ? total : 0;
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || '';
    if (!token) {
      setCounts({ own: null, saved: null });
      return;
    }
    (async () => {
      try {
        const [own, saved] = await Promise.all([
          fetchCount('own').catch(() => null),
          fetchCount('saved').catch(() => null),
        ]);
        setCounts({ own, saved });
      } catch {
        setCounts({ own: null, saved: null });
      }
    })();
  }, []);

  const activeCount = tabIsOwn ? counts.own : counts.saved;
  const countText =
    activeCount == null
      ? '…'
      : `${activeCount} recipe${activeCount === 1 ? '' : 's'}`;

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

        <div className={s.countLine}>{countText}</div>
      </header>
      <Outlet />
    </section>
  );
}
