import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lawyer, setLawyer] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing tokens on app load
    const userToken = localStorage.getItem('userToken');
    const lawyerToken = localStorage.getItem('lawyerToken');
    const adminToken = localStorage.getItem('adminToken');

    if (userToken) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }

    if (lawyerToken) {
      const lawyerData = localStorage.getItem('lawyerData');
      if (lawyerData) {
        setLawyer(JSON.parse(lawyerData));
      }
    }

    if (adminToken) {
      const adminData = localStorage.getItem('adminData');
      if (adminData) {
        setAdmin(JSON.parse(adminData));
      }
    }

    setLoading(false);
  }, []);

  const userLogin = (token, userData) => {
    setUser(userData);
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const lawyerLogin = (token, lawyerData) => {
    setLawyer(lawyerData);
    localStorage.setItem('lawyerToken', token);
    localStorage.setItem('lawyerData', JSON.stringify(lawyerData));
  };

  const loginAdmin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  };

  const logoutLawyer = () => {
    setLawyer(null);
    localStorage.removeItem('lawyerToken');
    localStorage.removeItem('lawyerData');
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  };

  const getUserRole = () => {
    if (admin) return 'admin';
    if (lawyer) return 'lawyer';
    if (user) return 'user';
    return null;
  };

  const getToken = () => {
    if (admin) return localStorage.getItem('adminToken');
    if (lawyer) return localStorage.getItem('lawyerToken');
    if (user) return localStorage.getItem('userToken');
    return null;
  };

  const value = {
    user,
    lawyer,
    admin,
    loading,
    userLogin,
    lawyerLogin,
    loginAdmin,
    logoutUser,
    logoutLawyer,
    logoutAdmin,
    getUserRole,
    getToken,
    token: getToken(),
    userToken: localStorage.getItem('userToken'),
    lawyerToken: localStorage.getItem('lawyerToken'),
    backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000',
    isAuthenticated: !!(user || lawyer || admin)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
