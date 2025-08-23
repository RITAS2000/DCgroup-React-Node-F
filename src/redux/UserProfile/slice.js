import { createSlice } from '@reduxjs/toolkit';
import { fetchOwn, fetchSaved, removeSaved } from './thunks';

const initialState = {
  items: [],
  loading: false,
  error: null,
  totalPages: 1,
  page: 1,
  hasNext: false,
  currentRequestId: null,
};

const normalize = (payload) => {
  const box = payload?.data ?? payload;
  const list = box?.data ?? box?.recipes ?? box?.items ?? [];
  const totalPages =
    typeof box?.totalPages === 'number'
      ? box.totalPages
      : typeof box?.data?.totalPages === 'number'
      ? box.data.totalPages
      : undefined;
  const totalItems =
    (typeof box?.totalItems === 'number' && box.totalItems) ??
    (typeof box?.data?.totalItems === 'number' && box.data.totalItems) ??
    (Array.isArray(list) ? list.length : 0);

  return { list, totalPages, totalItems };
};

const resolveTotalPages = (tpFromApi, totalItems, limit = 12) => {
  if (typeof tpFromApi === 'number' && tpFromApi > 0) return tpFromApi;
  const safeLimit = Number(limit) > 0 ? Number(limit) : 12;
  return Math.max(1, Math.ceil((Number(totalItems) || 0) / safeLimit));
};

const applyFulfilled = (state, action) => {
  if (
    state.currentRequestId &&
    state.currentRequestId !== action.meta.requestId
  )
    return;

  state.loading = false;
  state.error = null;
  state.currentRequestId = null;

  const { list, totalPages, totalItems } = normalize(action.payload);
  const page = action.meta?.arg?.page ?? 1;
  const replace = action.meta?.arg?.replace ?? page <= 1;
  const limit = action.meta?.arg?.limit ?? 12;

  const tp = resolveTotalPages(totalPages, totalItems, limit);

  state.page = page;
  state.totalPages = tp;
  state.hasNext = page < tp;

  if (replace) {
    state.items = list;
  } else {
    const seen = new Set(state.items.map((x) => String(x.id ?? x._id)));
    for (const it of list) {
      const key = String(it.id ?? it._id);
      if (!seen.has(key)) {
        state.items.push(it);
        seen.add(key);
      }
    }
  }
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    resetProfile: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    const onPending = (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentRequestId = action.meta.requestId;

      const page = action.meta?.arg?.page ?? 1;
      const replace = action.meta?.arg?.replace ?? page <= 1;
      if (replace) {
        state.items = [];
        state.page = 1;
        state.totalPages = 1;
        state.hasNext = false;
      }
    };

    const onRejected = (state, action) => {
      if (
        state.currentRequestId &&
        state.currentRequestId !== action.meta.requestId
      )
        return;

      state.loading = false;
      state.currentRequestId = null;
      state.error = action.payload || action.error?.message || 'Error';
      state.hasNext = false;
    };

    builder
      .addCase(fetchOwn.pending, onPending)
      .addCase(fetchOwn.fulfilled, applyFulfilled)
      .addCase(fetchOwn.rejected, onRejected)

      .addCase(fetchSaved.pending, onPending)
      .addCase(fetchSaved.fulfilled, applyFulfilled)
      .addCase(fetchSaved.rejected, onRejected)

      .addCase(removeSaved.fulfilled, (state, action) => {
        const id = String(action.payload);
        state.items = state.items.filter(
          (it) => String(it.id ?? it._id) !== id,
        );
      });
  },
});

export const { resetProfile } = userProfileSlice.actions;

export const selectProfile = (s) => s.userProfile;
export const selectProfileItems = (s) => s.userProfile.items;
export const selectProfileLoading = (s) => s.userProfile.loading;
export const selectProfileError = (s) => s.userProfile.error;
export const selectProfilePage = (s) => s.userProfile.page;
export const selectProfileTotalPages = (s) => s.userProfile.totalPages;
export const selectProfileHasNext = (s) => s.userProfile.hasNext;

export default userProfileSlice.reducer;
