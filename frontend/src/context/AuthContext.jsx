import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utility function to safely parse JSON
const safeJSONParse = (str) => {
  if (!str || str === 'undefined' || str === 'null') {
    return null;
  }
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
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
      const userData = safeJSONParse(localStorage.getItem('userData'));
      if (userData) {
        setUser(userData);
      } else if (localStorage.getItem('userData')) {
        // Clean up corrupted data
        localStorage.removeItem('userData');
        localStorage.removeItem('userToken');
      }
    }

    if (lawyerToken) {
      const lawyerData = safeJSONParse(localStorage.getItem('lawyerData'));
      if (lawyerData) {
        setLawyer(lawyerData);
      } else if (localStorage.getItem('lawyerData')) {
        // Clean up corrupted data
        localStorage.removeItem('lawyerData');
        localStorage.removeItem('lawyerToken');
      }
    }

    if (adminToken) {
      const adminData = safeJSONParse(localStorage.getItem('adminData'));
      if (adminData) {
        setAdmin(adminData);
      } else if (localStorage.getItem('adminData')) {
        // Clean up corrupted data
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminToken');
      }
    }

    setLoading(false);
  }, []);

  const userLogin = (token, userData) => {
    if (token && userData && typeof userData === 'object') {
      setUser(userData);
      localStorage.setItem('userToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      console.error('Invalid user login data');
    }
  };

  const lawyerLogin = (token, lawyerData) => {
    if (token && lawyerData && typeof lawyerData === 'object') {
      setLawyer(lawyerData);
      localStorage.setItem('lawyerToken', token);
      localStorage.setItem('lawyerData', JSON.stringify(lawyerData));
    } else {
      console.error('Invalid lawyer login data');
    }
  };

  const loginAdmin = (adminData, token) => {
    if (token && adminData && typeof adminData === 'object') {
      setAdmin(adminData);
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(adminData));
    } else {
      console.error('Invalid admin login data');
    }
  };

  const userLogout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    // Dispatch event to notify AppContext
    window.dispatchEvent(new Event('userLoggedOut'));
  };

  const lawyerLogout = () => {
    setLawyer(null);
    localStorage.removeItem('lawyerToken');
    localStorage.removeItem('lawyerData');
    // Dispatch event to notify AppContext
    window.dispatchEvent(new Event('lawyerLoggedOut'));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    // Dispatch event to notify AppContext
    window.dispatchEvent(new Event('adminLoggedOut'));
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
    userLogout,
    lawyerLogout,
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
