import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { getAccessTokenFromSessionStorage } from '../auxFunc/jwt';

const TopNavigator = () => {
  const [menuVisible, setMenuVisible] = useState(false); // State to manage the visibility of the menu
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage the authentication status


  useEffect(() => {
    // Check if the user is authenticated
    const checkAuthentication = async () => {
      const accessToken = await getAccessTokenFromSessionStorage();
      const refreshToken = localStorage.getItem("refresh_token");

      // Check if the tokens exist
      if (accessToken && refreshToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication(); // Call the function to check authentication
  }, []);

  // Function to handle the profile click
  const handleProfileClick = () => {
    // Only show the menu if the user is authenticated
    if (!isAuthenticated) {
      return;
    }
    setMenuVisible(!menuVisible); // Alternates the visibility of the menu
  };

  const handleListClick= () => {

    if (!isAuthenticated){
      return;
    }
    window.location = '/dashboard'
  }

  // Function to handle the logout
  const handleLogout = () => {
    // Delete the tokens from the session and local
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  
    // Switch the authentication status to false
    setIsAuthenticated(false);
    setMenuVisible(false);
    setTimeout(() => {
      window.location = '/';
    } , 1001);
  
  };
  

  return (
    <div id="topNavigator" className="bg-purple-600 h-16 flex items-center justify-between px-4 shadow-md">
      {/* Dashboard button */}
      <button className="text-white text-lg focus:outline-none" onClick={handleListClick}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      
      {/* Profile and logout buttons */}
      <div className="relative">
        <button className="text-white text-lg focus:outline-none" onClick={handleProfileClick}>
          <FontAwesomeIcon icon={faUserCircle} />
        </button>
        {/* Deployable menu */}
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
