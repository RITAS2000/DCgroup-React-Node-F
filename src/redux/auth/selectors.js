export const selectIsAuthenticated = (s) => Boolean(s.auth?.token);
export const selectAuthLoading = (s) => Boolean(s.auth?.loading);
