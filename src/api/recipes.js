export const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/+$/, '');
export const PAGE_SIZE = 12;

/*const withLeadingSlash = (path) => (path.startsWith('/') ? path : `/${path}`);*/

async function parseResponse(res) {
  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return await res.json();
  }
  const text = await res.text().catch(() => '');
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function toError(res, payload) {
  const msg =
    (payload && (payload.message || payload.error || payload.detail)) ||
    `${res.status} ${res.statusText}`;
  const err = new Error(String(msg));
  err.status = res.status;
  err.payload = payload;
  return err;
}

function effectiveToken(passedToken) {
  if (passedToken) return passedToken;
  if (import.meta.env.VITE_DEV_FORCE_AUTH === 'true') {
    return import.meta.env.VITE_DEV_TOKEN || '';
  }
  return '';
}

export async function apiFetch(
  path,
  { page = 1, limit = PAGE_SIZE, token, signal } = {},
) {
  const url = new URL(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`);
  if (path.includes('/own') || path.includes('/saved-recipes')) {
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));
  }

  const res = await fetch(url, {
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(effectiveToken(token)
        ? { Authorization: `Bearer ${effectiveToken(token)}` }
        : {}),
    },
  });

  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json')
    ? await res.json()
    : await res.text().catch(() => '');
  if (!res.ok)
    throw new Error(data?.message || `${res.status} ${res.statusText}`);
  return data;
}

export async function deleteFavorite(recipeId, token, signal) {
  if (!recipeId) throw new Error('Recipe id is required');
  const url = new URL(`${API_BASE}/api/recipes/saved-recipes/${recipeId}`);

  const res = await fetch(url, {
    method: 'DELETE',
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseResponse(res);
  if (!res.ok) throw toError(res, data);
  return true;
}

export function getImageUrl(src) {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith('/')) return `${API_BASE}${src}`;
  return `${API_BASE}/${src}`;
}
