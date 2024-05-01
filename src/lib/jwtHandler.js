import { jwtDecode } from "jwt-decode";

export async function saveAccessTokenToLocalStorage(token) {
  localStorage.setItem("access_token", token);
};

export async function saveRefreshTokenToLocalStorage(token) {
  localStorage.setItem("refresh_token", token);
};

async function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  return decoded["exp"] < Date.now() / 1000;
}

export async function getAccessTokenFromLocalStorage() {
  let accessToken = localStorage.getItem("access_token");
  if (accessToken && await isTokenExpired(accessToken)) {
    const data = await setAccessTokenUsingRefreshToken();
    localStorage.setItem("access_token", data["access_token"]);
  }
  return accessToken;
};

export async function getRefreshTokenFromLocalStorage() {
  return localStorage.getItem("refresh_token");
};

async function setAccessTokenUsingRefreshToken() {

  const fetchRefreshToken = async () => {
    try {
      const refreshToken = await getRefreshTokenFromLocalStorage();
      const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/user/refresh`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`
        }
      });
      return response;
    } catch (error) {
      throw new Error("Failed to fetch to obtain new access token" + error);
    }
  }

  const response = await fetchRefreshToken();
  const data = await response.json();
  const code_error = response["status"];
  if (!response.ok) {
    const { message } = data;
    throw new Error(message + ". \nError code: " + code_error);
  }
  return data;
};

export async function clearAuthTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};