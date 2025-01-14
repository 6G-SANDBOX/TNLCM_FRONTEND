import React, { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { getAccessTokenFromSessionStorage } from "./auxFunc/jwt";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Usar null para representar estado de carga

  useEffect(() => {
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

  // Mientras el estado se esté cargando, mostramos el gif de carga
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/images/loading.gif" alt="Loading..." />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Ruta para Login */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        {/* Ruta para Dashboard */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
