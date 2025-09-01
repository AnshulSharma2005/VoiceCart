import React, { useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/useAuth';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
    signupSuccess,
    clearSignupSuccess,
  } = useAuth();

  const navigate = useNavigate();

  // Show success alert after signup and redirect to login
useEffect(() => {
  if (signupSuccess) {
    toast.success("VocalCart: Account created successfully! Please log in.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        background: "linear-gradient(to right, #9333ea, #ec4899)", // purple → pink
        color: "#fff",
        fontWeight: "600",
        borderRadius: "12px",
        padding: "12px 16px",
      },
      icon: <span>🛒</span>, // ✅ JSX instead of string
    });
    clearSignupSuccess();
    navigate('/login');
  }
}, [signupSuccess, navigate, clearSignupSuccess]);



  // Auto clear error message
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <p className="text-gray-600">Loading your shopping assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={
            isAuthenticated && user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage
                onLogin={login}
                onSignup={signup}
                isLoading={isLoading}
                error={error}
              />
            )
          }
        />

        {/* Dashboard Page */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && user ? (
              <Dashboard user={user} onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default Route - Redirect to Dashboard or Login */}
        <Route
          path="*"
          element={
            isAuthenticated && user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {/* ✅ Toast container must be OUTSIDE <Routes> */}
      <ToastContainer />
    </>
  );
}

export default App;
