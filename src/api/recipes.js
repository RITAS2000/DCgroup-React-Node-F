// src/api/recipes.js
const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/+$/, '');
export { API_BASE };

export const PAGE_SIZE = 12;

// універсальний фетч з авторизацією
async function doFetch(url, { token, signal } = {}) {
  const res = await fetch(url, {
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // спробуємо прочитати тіло (і JSON, і текст)
  // спробуємо прочитати тіло (і JSON, і текст)
  const bodyText = await res.text().catch(() => ''); // ← без пустого catch
  let body = null;
  try {
    body = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    body = bodyText || null;
  }

  if (!res.ok) {
    const msg =
      (body && (body.message || body.error || body.statusText)) ||
      res.statusText ||
      'Request failed';
    const err = new Error(`${res.status} ${msg}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body ?? {};
}

/**
 * apiFetch('/api/recipes/own', { page, limit, token, signal })
 * apiFetch('/api/recipes/saved-recipes', { page, limit, token, signal })
 */
export async function apiFetch(
  path,
  { page = 1, limit = PAGE_SIZE, token, signal } = {},
) {
  // збираємо спроби: спочатку perPage, потім limit
  const attempts = [];
  const isPaginated = /\/own$|\/saved-recipes$/.test(path);

  if (isPaginated) {
    // 1) page + perPage
    const u1 = new URL(`${API_BASE}${path}`);
    u1.searchParams.set('page', String(page));
    u1.searchParams.set('perPage', String(limit));
    attempts.push(u1);

    // 2) page + limit (fallback на випадок старих валідаторів)
    const u2 = new URL(`${API_BASE}${path}`);
    u2.searchParams.set('page', String(page));
    u2.searchParams.set('limit', String(limit));
    attempts.push(u2);
  } else {
    // без пагінації
    attempts.push(new URL(`${API_BASE}${path}`));
  }

  // Послідовно пробуємо всі варіанти, поки не отримаємо ok
  let lastErr = null;
  for (const url of attempts) {
    try {
      // console.debug('[API GET]', url.pathname + url.search);
      return await doFetch(url, { token, signal });
    } catch (e) {
      lastErr = e;
      // якщо 400 / 404 — пробуємо наступний варіант
      if (e?.status === 400 || e?.status === 404) continue;
      // інші помилки віддаємо одразу
      throw e;
    }
  }
  // якщо всі варіанти впали
  throw lastErr || new Error('Request failed');
}

export async function deleteFavorite(recipeId, token, signal) {
  const url = new URL(`${API_BASE}/api/recipes/saved-recipes/${recipeId}`);
  const res = await fetch(url, {
    method: 'DELETE',
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return `${API_BASE}${src}`;
  return `${API_BASE}/${src}`;
}
