import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { getAccessTokenFromSessionStorage } from '../auxFunc/jwt';

const TopNavigator = () => {
  const [menuVisible, setMenuVisible] = useState(false); // Estado para manejar la visibilidad del menú
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para manejar la autenticación


  useEffect(() => {
    // Función asincrónica para verificar el token
    const checkAuthentication = async () => {
      const accessToken = await getAccessTokenFromSessionStorage();
      const refreshToken = localStorage.getItem("refresh_token");

      // Verificar si ambos tokens están presentes
      if (accessToken && refreshToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication(); // Llamar la función de verificación
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Función para manejar el clic en el botón de perfil
  const handleProfileClick = () => {
    // Solo permitir mostrar el menú si está autenticado
    if (!isAuthenticated) {
      return; // Si no está autenticado, no hacer nada
    }
    setMenuVisible(!menuVisible); // Alternar la visibilidad del menú
  };

  const handleListClick= () => {

    if (!isAuthenticated){
      return;
    }
    window.location = '/dashboard'
  }
  // Función para cerrar sesión y eliminar los tokens
  const handleLogout = () => {
    // Eliminar los tokens de sessionStorage y localStorage
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  
    // Cambiar los estados de autenticación y visibilidad del menú
    setIsAuthenticated(false);
    setMenuVisible(false); // Ocultar el menú después de cerrar sesión
    setTimeout(() => {
      window.location = '/';
    } , 1001);
  
  };
  

  return (
    <div id="topNavigator" className="bg-purple-600 h-16 flex items-center justify-between px-4 shadow-md">
      {/* Boton para ir  a dashboard */}
      <button className="text-white text-lg focus:outline-none" onClick={handleListClick}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      
      {/* Botón para perfil y logout siempre visible */}
      <div className="relative">
        <button className="text-white text-lg focus:outline-none" onClick={handleProfileClick}>
          <FontAwesomeIcon icon={faUserCircle} />
        </button>
        {/* Menú desplegable */}
        {menuVisible && isAuthenticated && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-lg"
            >
              Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 hover:rounded-lg"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavigator;
