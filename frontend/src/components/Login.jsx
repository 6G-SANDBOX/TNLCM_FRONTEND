import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Footer from './Footer';
import TopNavigator from './TopNavigator'; // Asegúrate de importar el componente correctamente.

const Login = () => {
  return (
    <div className="bg-white font-sans min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <TopNavigator />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl">
          
          {/* Form Section */}
          <div className="flex flex-col items-center w-full max-w-md">
            {/* Email Input */}
            <div className="w-full mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input type="email" id="email" value="correo@uma.es" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                <FontAwesomeIcon icon={faEnvelope} className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Password Input */}
            <div className="w-full mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input type="password" id="password" value="**********" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                <FontAwesomeIcon icon={faLock} className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100">
                Log in
              </button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
                Sign up
              </button>
            </div>
          </div>

          {/* Logo Section */}
          <div className="mt-8 md:mt-0 md:ml-60 flex justify-center">
            <img src="/6gSandboxLogo.png" alt="Sandbox logo with a geometric design and the text 'Sandbox'" className="w-80" />
          </div>
        </div>
      </div>

      {/* Footer */}
        <Footer />
    </div>
  );
};

export default Login;
