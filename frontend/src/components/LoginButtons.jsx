import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginButtons = () => {
  const navigate = useNavigate();
  const { user, lawyer, admin, userLogout, lawyerLogout, logoutAdmin, getUserRole } = useAuth();
  
  const currentUser = user || lawyer || admin;
  const userRole = getUserRole();

  const handleLogout = () => {
    if (userRole === 'user') {
      userLogout();
      toast.success('User logged out successfully');
    } else if (userRole === 'lawyer') {
      lawyerLogout();
      toast.success('Lawyer logged out successfully');
    } else if (userRole === 'admin') {
      logoutAdmin();
      toast.success('Admin logged out successfully');
    }
    navigate('/');
  };

  const handleLogin = (type) => {
    if (type === 'user') {
      navigate('/login');
    } else if (type === 'lawyer') {
      navigate('/lawyer-login');
    } else if (type === 'admin') {
      navigate('/admin-login');
    }
  };

  if (currentUser) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {currentUser.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{currentUser.name}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLogin('user')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        User Login
      </button>
      <button
        onClick={() => handleLogin('lawyer')}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
      >
        Lawyer Login
      </button>
      <button
        onClick={() => handleLogin('admin')}
        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
      >
        Admin
      </button>
    </div>
  );
};

export default LoginButtons;
