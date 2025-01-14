import axios from "axios";
import { jwtDecode } from 'jwt-decode'; // Asegúrate de que esta librería esté instalada

// Verifica si el token ha expirado
export async function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  return decoded["exp"] < Date.now() / 1000;
}

// Obtén el token de acceso desde sessionStorage, actualízalo si está expirado
export async function getAccessTokenFromSessionStorage() {
  let accessToken = sessionStorage.getItem("access_token");
  
  // Si el token existe y ha expirado, intenta obtener un nuevo token
  if (accessToken && await isTokenExpired(accessToken)) {
    const data = await setAccessTokenUsingRefreshToken();
    sessionStorage.setItem("access_token", data["access_token"]); // Guardar en sessionStorage
    accessToken = data["access_token"]; // Actualiza el token con el nuevo valor
  }
  return accessToken;
}

// Obtiene el refresh token desde localStorage
export function getRefreshTokenFromLocalStorage() {
  return localStorage.getItem("refresh_token");
}

// Solicita un nuevo access token usando el refresh token
async function setAccessTokenUsingRefreshToken() {
  const refreshToken = getRefreshTokenFromLocalStorage();

  // Si no existe un refresh token, no podemos proceder
  if (!refreshToken) {
    throw new Error("No refresh token found.");
  }

  try {
    // Solicitar un nuevo token usando el refresh token
    //Coger la URL de la página
    const url =process.env.REACT_APP_ENDPOINT;
    const response = await axios.post(
      `${url}/tnlcm/user/refresh`,
      {}, // El cuerpo de la solicitud puede estar vacío
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
      }
    );

    // Verificar la respuesta
    if (!response.data || !response.data.access_token) {
      throw new Error("Failed to refresh access token.");
    }

    return response.data; // Contiene el nuevo access_token
  } catch (error) {
    throw new Error("Failed to fetch a new access token: " + error.message);
  }
}
