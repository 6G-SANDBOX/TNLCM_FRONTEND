export function saveAccessTokenToLocalStorage(token) {
  localStorage.setItem("access_token", token);
};

export function saveRefreshTokenToLocalStorage(token) {
  localStorage.setItem("refresh_token", token);
};

export function getAccessTokenFromLocalStorage() {
  return localStorage.getItem("access_token");
};

export function getRefreshTokenFromLocalStorage() {
  return localStorage.getItem("refresh_token");
};

export function clearAuthTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};