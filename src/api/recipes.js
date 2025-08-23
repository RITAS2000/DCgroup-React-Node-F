// src/api/recipes.js
// ------------------------------------------------------------
// БАЗОВІ НАЛАШТУВАННЯ
// ------------------------------------------------------------
export const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/+$/, '');

export const PAGE_SIZE = 12;

// ------------------------------------------------------------
// СЕРВІСНІ ФУНКЦІЇ
// ------------------------------------------------------------

/** універсальний fetch з хедерами + адекватним парсингом помилок */
async function doFetch(
  input,
  { method = 'GET', token, signal, headers, body } = {},
) {
  const res = await fetch(input, {
    method,
    signal,
    headers: {
      ...(body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'omit',
  });

  const text = await res.text().catch(() => '');
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      res.statusText ||
      'Request failed';
    const err = new Error(`${res.status} ${msg}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data ?? {};
}

/**
 * apiFetch — GET з підтримкою двох варіантів пагінації:
 *   - page + perPage
 *   - page + limit   (fallback для старих валідаторів)
 */
export async function apiFetch(
  path,
  { page = 1, limit = PAGE_SIZE, token, signal } = {},
) {
  const attempts = [];
  const needsPagination = /\/own$|\/saved-recipes$/.test(path);

  if (needsPagination) {
    const u1 = new URL(`${API_BASE}${path}`);
    u1.searchParams.set('page', String(page));
    u1.searchParams.set('perPage', String(limit));
    attempts.push(u1);

    const u2 = new URL(`${API_BASE}${path}`);
    u2.searchParams.set('page', String(page));
    u2.searchParams.set('limit', String(limit));
    attempts.push(u2);
  } else {
    attempts.push(new URL(`${API_BASE}${path}`));
  }

  let lastErr = null;
  for (const url of attempts) {
    try {
      return await doFetch(url, { token, signal });
    } catch (e) {
      lastErr = e;
      if (e?.status === 400 || e?.status === 404) continue; // пробуємо інший варіант
      throw e;
    }
  }
  throw lastErr || new Error('Request failed');
}

/** нормалізація пагінованої відповіді від різних беків */
function normalizePagedResponse(raw) {
  // варіант 1: { status, message, data: { data: [...], page, perPage, totalItems, totalPages } }
  if (raw?.data?.data && Array.isArray(raw.data.data)) {
    const p = raw.data;
    return {
      items: p.data,
      page: Number(p.page ?? 1),
      perPage: Number(p.perPage ?? PAGE_SIZE),
      totalItems: Number(p.totalItems ?? p.data.length ?? 0),
      totalPages: Number(p.totalPages ?? 1),
    };
  }
  // варіант 2: { items, page, perPage/limit, totalItems, totalPages }
  if (Array.isArray(raw?.items)) {
    return {
      items: raw.items,
      page: Number(raw.page ?? 1),
      perPage: Number(raw.perPage ?? raw.limit ?? PAGE_SIZE),
      totalItems: Number(raw.totalItems ?? raw.items.length ?? 0),
      totalPages: Number(raw.totalPages ?? 1),
    };
  }
  // варіант 3: просто масив
  if (Array.isArray(raw)) {
    const items = raw;
    return {
      items,
      page: 1,
      perPage: items.length,
      totalItems: items.length,
      totalPages: 1,
    };
  }
  // fallback
  const items = raw?.data ?? [];
  return {
    items: Array.isArray(items) ? items : [],
    page: Number(raw?.page ?? 1),
    perPage: Number(raw?.perPage ?? PAGE_SIZE),
    totalItems: Number(
      raw?.totalItems ?? (Array.isArray(items) ? items.length : 0),
    ),
    totalPages: Number(raw?.totalPages ?? 1),
  };
}

// ------------------------------------------------------------
// ПУБЛІЧНІ API-ФУНКЦІЇ
// ------------------------------------------------------------

/** Мої рецепти (own) — page + limit */
export async function getOwnRecipes({
  page = 1,
  limit = PAGE_SIZE,
  token,
  signal,
} = {}) {
  const raw = await apiFetch('/api/recipes/own', {
    page,
    limit,
    token,
    signal,
  });
  return normalizePagedResponse(raw);
}

/** Збережені рецепти (favorites) — page + perPage */
export async function getSavedRecipes({
  page = 1,
  perPage = PAGE_SIZE,
  token,
  signal,
} = {}) {
  const raw = await apiFetch('/api/recipes/saved-recipes', {
    page,
    limit: perPage,
    token,
    signal,
  });
  return normalizePagedResponse(raw);
}

/** Додати до збережених (favorites) */
export async function addFavorite(recipeId, token, signal) {
  const url = `${API_BASE}/api/recipes/saved-recipes`;
  return doFetch(url, {
    method: 'POST',
    token,
    signal,
    body: { recipeId },
  });
}

/** Видалити зі збережених */
export async function deleteFavorite(recipeId, token, signal) {
  const url = `${API_BASE}/api/recipes/saved-recipes/${recipeId}`;
  return doFetch(url, {
    method: 'DELETE',
    token,
    signal,
  });
}

/** Деталі рецепта */
export async function getRecipeById(id, { token, signal } = {}) {
  const url = `${API_BASE}/api/recipes/${id}`;
  return doFetch(url, { token, signal });
}

/**
 * Створити рецепт.
 * Працює і з JSON, і з multipart/form-data:
 *  - JSON:  createRecipe({ body: {...}, token })
 *  - multipart: createRecipe({ formData, token })
 */
export async function createRecipe({ body, formData, token, signal } = {}) {
  const url = `${API_BASE}/api/recipes`;

  if (formData instanceof FormData) {
    // multipart (з фото)
    return doFetch(url, {
      method: 'POST',
      token,
      signal,
      body: formData,
      headers: {},
    });
  }
  // application/json
  return doFetch(url, { method: 'POST', token, signal, body });
}

/** Формування абсолютної URL для зображень/файлів */
export function getImageUrl(src) {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return `${API_BASE}${src}`;
  return `${API_BASE}/${src}`;
}
