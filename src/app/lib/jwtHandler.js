import { jwtDecode } from 'jwt-decode';

export function saveAccessTokenToLocalStorage(token) {
  localStorage.setItem('access_token', token);
};

export function saveRefreshTokenToLocalStorage(token) {
  localStorage.setItem('refresh_token', token);
};

function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  if (decoded.exp < Date.now() / 1000) {
    return true;
  }
  return false;
}

export async function getAccessTokenFromLocalStorage() {
  let accessToken = localStorage.getItem('access_token');
  if (accessToken && isTokenExpired(accessToken)) {
    data = await setAccessUsingRefreshToken();
    accessToken = data['access_token'];
  }
  return accessToken;
};

export function getRefreshTokenFromLocalStorage() {
  return localStorage.getItem('refresh_token');
};

async function setAccessUsingRefreshToken() {

  const fetchRefreshToken = async () => {
    try {
      const refreshToken = getRefreshTokenFromLocalStorage();
      const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/user/refresh`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      throw new Error('Failed to fetch to obtain new access token' + error);
    }
  }

  const response = await fetchRefreshToken();
  const data = await response.json();
  const code_error = response['status'];
  if (!response.ok) {
    const { message } = data;
    throw new Error(message + '. \nError code: ' + code_error);
  }
  return data;
}

export function clearAuthTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};