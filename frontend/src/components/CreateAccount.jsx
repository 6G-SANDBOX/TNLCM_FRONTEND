import {
  faArrowRight,
  faBuilding,
  faEnvelope,
  faLock,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios"; // Importa axios
import React, { useState } from "react";
  
  const CreateAccount = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [organization, setOrganization] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      //Coger la URL de la página
      const url =process.env.REACT_APP_ENDPOINT;
      // Validación de contraseña
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/; // al menos 1 mayúscula, 1 minúscula y 1 número
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }
  
      if (!passwordPattern.test(password)) {
        setErrorMessage(
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        );
        return;
      }
  
      setErrorMessage(""); // Limpiar mensaje de error si todo es correcto
  
      // Crear el objeto JSON con los datos del formulario
      const accountData = {
        "email": email,
        "username": username,
        "password": password,
        "org": organization,
      };
  
      try {
        const response = await axios.post(
          `${url}/tnlcm/user/register`,
          accountData
        );
        console.log("Account created successfully:", response.data);
        onClose(); // Cerrar el modal
      } catch (error) {
        if (error.response) {
          if (error.response.status === 409) {
            setErrorMessage("Ya existe el usuario o el correo");
          } else {
            setErrorMessage(
              `Error inesperado: ${error.response.status} - ${error.response.data.message || "Por favor intenta nuevamente"}`
            );
          }
        } else {
          setErrorMessage("Error de conexión al servidor. Por favor, verifica tu red.");
        }
        console.error("Error creating account:", error);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg w-96 p-6 relative">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 text-lg"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
  
          {/* Title */}
          <h1 className="text-center text-2xl font-semibold mb-6">
            Create an Account
          </h1>
  
          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute right-4 top-3.5 text-gray-400"
              />
            </div>
  
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-d3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FontAwesomeIcon
                icon={faUser}
                className="absolute right-4 top-3.5 text-gray-400"
              />
            </div>
  
            {/* Organization Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FontAwesomeIcon
                icon={faBuilding}
                className="absolute right-4 top-3.5 text-gray-400"
              />
            </div>
  
            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FontAwesomeIcon
                icon={faLock}
                className="absolute right-4 top-3.5 text-gray-400"
              />
            </div>
  
            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FontAwesomeIcon
                icon={faLock}
                className="absolute right-4 top-3.5 text-gray-400"
              />
            </div>
  
            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
  
            {/* Register Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-b-3xl hover:bg-purple-700 flex items-center justify-center"
              >
                Register <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default CreateAccount;
  