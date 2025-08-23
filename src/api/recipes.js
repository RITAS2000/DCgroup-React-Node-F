// src/api/recipes.js
export const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/+$/, '');
export const PAGE_SIZE = 12;

// дуже проста перевірка, що токен схожий на JWT
export const isJwt = (t) =>
  /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(t || '');
const effectiveToken = (t) => (isJwt(t) ? t : '');

/**
 * УВАГА: тепер функція має 3-й аргумент opts (для signal тощо)
 */
export async function apiFetch(path, params = {}, opts = {}) {
  const { page = 1, limit = PAGE_SIZE, token } = params;
  const { signal } = opts;

  const url = new URL(`${API_BASE}${path}`);
  const requiresAuth = path.includes('/own') || path.includes('/saved-recipes');

  if (path.includes('/own') || path.includes('/saved-recipes')) {
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));
  }

  // беремо токен з аргументів або з localStorage, і приймаємо його лише якщо він схожий на JWT
  const tok = effectiveToken(token || localStorage.getItem('accessToken'));

  // 🧯 Гість або сміттєвий токен → НЕ робимо fetch, віддаємо порожні дані
  if (requiresAuth && !tok) {
    return { data: [], totalPages: 1, totalItems: 0 };
  }

  const res = await fetch(url, {
    method: 'GET',
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
    },
  });

  // якщо бек відповів помилкою — для 400/401 повернемо «порожній» результат, щоб не ламати UI
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    if (res.status === 400 || res.status === 401) {
      return {
        data: [],
        totalPages: 1,
        totalItems: 0,
        error: `${res.status} ${res.statusText} ${text}`,
      };
    }
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export async function deleteFavorite(recipeId, token, signal) {
  const tok = effectiveToken(token || localStorage.getItem('accessToken'));
  if (!tok) return false; // гість — нічого не робимо

  const url = new URL(`${API_BASE}/api/recipes/saved-recipes/${recipeId}`);
  const res = await fetch(url, {
    method: 'DELETE',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tok}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  return true;
}

export function getImageUrl(src) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  if (src.startsWith('/')) return `${API_BASE}${src}`;
  return `${API_BASE}/${src}`;
}
