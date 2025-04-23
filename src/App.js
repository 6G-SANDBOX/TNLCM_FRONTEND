import React, { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { getAccessTokenFromSessionStorage } from "./auxFunc/jwt";
import CreateTN from "./components/CreateTN";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Network from "./components/Network";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Use null to indicate that we are still checking authentication status

  useEffect(() => {
    // Function to check if the user is authenticated
    const checkAuthentication = async () => {
      const token = await getAccessTokenFromSessionStorage();
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuthentication();
  }, []);

  // While loading authentication status, show a loading spinner
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="loading.gif" alt="Loading..." />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Route for initializing */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        {/* Route for dashboard */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        {/* Route for create trial network */}
         <Route
          path="/dashboard/createTN"
          element={isAuthenticated ? <CreateTN /> : <Navigate to="/" />}
        />
        {/* Route for editing a TN */}
        <Route
          path="/dashboard/:id"
          element={isAuthenticated ? <Network/> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
