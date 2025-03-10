import axios from "axios";
import { jwtDecode } from 'jwt-decode';

// Check if the token is expired
export async function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  return decoded["exp"] < Date.now() / 1000;
}

// Get the access token from the session storage and check if it has expired
export async function getAccessTokenFromSessionStorage() {
  let accessToken = sessionStorage.getItem("access_token");
  
  // If the token is expired, try to get a new one using the refresh token
  if (accessToken && await isTokenExpired(accessToken)) {
    const data = await setAccessTokenUsingRefreshToken();
    sessionStorage.setItem("access_token", data["access_token"]);
    accessToken = data["access_token"];
  }
  return accessToken;
}

// Get the refresh token from the local storage
export function getRefreshTokenFromLocalStorage() {
  return localStorage.getItem("refresh_token");
}

// Set the access token using the refresh token
async function setAccessTokenUsingRefreshToken() {
  const refreshToken = getRefreshTokenFromLocalStorage();

  // If the refresh token is not found, throw an error
  if (!refreshToken) {
    throw new Error("No refresh token found.");
  }

  try {
    const url =process.env.REACT_APP_TNLCM_BACKEND_API;
    const response = await axios.post(
      `${url}/tnlcm/user/refresh`,
      {},
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
      }
    );
    if (!response.data || !response.data.access_token) {
      throw new Error("Failed to refresh access token.");
    }

    return response.data; // Return the new access token
  } catch (error) {
    throw new Error("Failed to fetch a new access token: " + error.message);
  }
}
