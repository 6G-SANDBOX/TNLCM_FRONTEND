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
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    try {
      // Llamamos a la función loginUser pasando el usuario y password
      const response = await loginUser(user, password);

      // Suponiendo que el servidor devuelve un JSON con access_token y refresh_token
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      // Guardamos el access_token en sessionStorage (solo para la sesión actual)
      sessionStorage.setItem("access_token", accessToken);
      // Guardamos el refresh_token en localStorage (para persistirlo entre sesiones)
      localStorage.setItem("refresh_token", refreshToken);
      
      setSuccess("Login successful!");
      setError(""); // Limpiamos el mensaje de error
      setTimeout(() => {
       window.location = '/dashboard';
      } , 1002);
    } catch (err) {
      // Manejar errores
      setError(err.message || "Login failed. Please try again.");
      setSuccess(""); // Limpiamos el mensaje de éxito
    }
  };

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col relative">
      <TopNavigator />

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl">
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
          <div className="mt-8 md:mt-0 md:ml-60 flex justify-center">
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

export async function loginUser(username, password) {
  const authString = `${username}:${password}`;
  const encodedAuth = window.btoa(unescape(encodeURIComponent(authString))); // Soporta caracteres especiales
  const basicAuthHeader = `Basic ${encodedAuth}`;

  try {
    // Leer la URL desde el archivo .env
    const url = process.env.REACT_APP_ENDPOINT;
    const response = await axios.post(
      `${url}/tnlcm/user/login`,
      {}, // No hay cuerpo, ya que el auth está en los headers
      {
        headers: {
          Authorization: basicAuthHeader,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    alert(error.response?.data?.message || "Login failed. Please try again.");
  }
}
