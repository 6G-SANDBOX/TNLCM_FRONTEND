import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState } from "react";
import CreateAccount from "./CreateAccount";
import Footer from "./Footer";
import TopNavigator from "./TopNavigator";

const Login = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario
    try {
      // Configura un timeout de 5 segundos
      const response = await loginUser(user, password, { timeout: 5000 }); // Timeout en 5 segundos
  
      // Suponiendo que el servidor devuelve un JSON con access_token y refresh_token
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
  
      // Guarda el access_token en sessionStorage (solo para la sesión actual)
      sessionStorage.setItem("access_token", accessToken);
      // Guarda el refresh_token en localStorage (para persistirlo entre sesiones)
      localStorage.setItem("refresh_token", refreshToken);
  
      setSuccess("Login successful!");
      setError(""); // Limpia los mensajes de error
      setTimeout(() => {
        window.location = "/dashboard";
      }, 1002);
    } catch (err) {
      // Manejo de diferentes tipos de errores
      if (err.response) {
        // Errores con respuesta del servidor
        if (err.response.status === 404) {
          setError("The server is not responding.");
        } else {
          setError(err.message || "Login failed. Please try again.");
        }
      } else if (err.code === "ECONNABORTED") {
        // Errores por timeout
        setError("Can not connect with the server. The request timed out.");
      } else if (err.message === "Network Error") {
        // Errores de red generales
        setError("Network error. Please check your internet connection.");
      } else {
        // Otros errores
        setError( "Login failed. Please try again later.");
      }
      setSuccess(""); // Limpia los mensajes de éxito
    }
  };
  



  return (
    <div className="bg-white font-sans min-h-screen flex flex-col relative">
      <TopNavigator />

      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl p-4">
          <div className="flex flex-col items-center w-full max-w-md">
            <form onSubmit={handleLogin} className="w-full space-y-4">
              {/* Input de email */}
              <div className="w-full mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={user}
                    placeholder="Enter your username"
                    autoComplete="username" // Correcto para un campo de nombre de usuario
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <FontAwesomeIcon icon={faEnvelope} className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>


              {/* Input de password */}
              <div className="w-full mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    placeholder="***********"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <FontAwesomeIcon icon={faLock} className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Mensajes de error o éxito */}
              {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
              {success && <div className="mb-4 text-green-500 text-sm">{success}</div>}

              {/* Botones */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Log in
                </button>
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                  onClick={() => setShowCreateAccount(true)}
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>

          {/* Logo */}
          <div className="mt-8 md:mt-0 md:ml-40 flex justify-center">
            <img src="/6gSandboxLogo.png" alt="Sandbox logo" className="w-80" />
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal de crear cuenta */}
      {showCreateAccount && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <CreateAccount onClose={() => setShowCreateAccount(false)} />
        </div>
      )}
    </div>
  );
};

export default Login;

export async function loginUser(username, password, config = {}) {
  // Construir la cadena de autenticación básica
  const authString = `${username}:${password}`;
  const encodedAuth = window.btoa(unescape(encodeURIComponent(authString))); // Soporta caracteres especiales
  const basicAuthHeader = `Basic ${encodedAuth}`;

  try {
    // Leer la URL base desde las variables de entorno
    const url = process.env.REACT_APP_ENDPOINT;

    // Realizar la solicitud POST al endpoint de login
    const response = await axios.post(
      `${url}/tnlcm/user/login`,
      {}, // No hay cuerpo, ya que la autenticación está en los headers
      {
        headers: {
          Authorization: basicAuthHeader, // Header de autenticación básica
          "Content-Type": "application/json",
        },
        ...config, // Incluye configuraciones adicionales como timeout
      }
    );

    // Devolver la respuesta si es exitosa
    return response;
  } catch (error) {
    // Lanzar el error para que el manejo ocurra en el lugar donde se llama esta función
    throw error;
  }
}

