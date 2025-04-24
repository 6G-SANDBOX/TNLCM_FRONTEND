import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { loginUser } from "../auxFunc/api";
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
    e.preventDefault(); // Prevents the default form submission behavior

    if (!user && !password) {
      setError("Username and password are required.");
      return;
    } else if (!user) {
      setError("Username is required.");
      return;
    } else if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      const response = await loginUser(user, password, { timeout: 2000 }); // Two seconds timeout

      // Supposing server sent us a JSON with access_token and refresh_token
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      // Save access_token in sessionStorage (only for this session)
      sessionStorage.setItem("access_token", accessToken);
      // Save refresh_token in localStorage (multiple sessions)
      localStorage.setItem("refresh_token", refreshToken);

      setSuccess("Login successful!");
      setError(""); // Clean error message
      setTimeout(() => {
        window.location = "/dashboard";
      }, 1002);
    } catch (err) {
      // Different error handling
      if (err.response) {
        // Server responded with an error status code
        if (err.response.status === 404) {
          setError("The server is not responding.");
        } else {
          setError(err.message || "Login failed. Please try again.");
        }
      } else if (err.code === "ECONNABORTED") {
        // Timeout error
        setError("Can not connect with the server. The request timed out.");
      } else if (err.message === "Network Error") {
        // Network error
        setError("Network error. Please check your internet connection.");
      } else {
        // Other errors
        setError("Login failed. Please try again later.");
      }
      setSuccess(""); // Clean success message
    }
  };

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col relative">
      <TopNavigator />

      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl p-4">
          <div className="flex flex-col items-center w-full max-w-md">
            <form onSubmit={handleLogin} className="w-full space-y-4">
              {/* Mail input */}
              <div className="w-full mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={user}
                    placeholder="Enter your username"
                    autoComplete="username"
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute right-3 top-3 text-gray-400"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="w-full mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute right-3 top-3 text-gray-400"
                  />
                </div>
              </div>

              {/* Error or succesful messages */}
              {error && (
                <div className="mb-4 text-red-500 text-sm">{error}</div>
              )}
              {success && (
                <div className="mb-4 text-green-500 text-sm">{success}</div>
              )}

              {/* Buttons */}
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

      {/* Create Account modal */}
      {showCreateAccount && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <CreateAccount onClose={() => setShowCreateAccount(false)} />
        </div>
      )}
    </div>
  );
};

export default Login;
