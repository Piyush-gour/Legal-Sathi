import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaUserTie, FaUserShield, FaTachometerAlt, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

const UserStatus = () => {
  const navigate = useNavigate();
  const { user, lawyer, admin, userLogout, lawyerLogout, logoutAdmin, getUserRole } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const currentUser = user || lawyer || admin;
  const userRole = getUserRole();

  const handleLogout = () => {
    if (userRole === 'user') {
      userLogout();
    } else if (userRole === 'lawyer') {
      lawyerLogout();
    } else if (userRole === 'admin') {
      logoutAdmin();
    }
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleDashboard = () => {
    if (userRole === 'user') {
      navigate('/user-dashboard');
    } else if (userRole === 'lawyer') {
      navigate('/lawyer-dashboard');
    } else if (userRole === 'admin') {
      navigate('/admin-dashboard');
    }
    setIsDropdownOpen(false);
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'user':
        return <FaUser className="h-4 w-4 text-blue-600" />;
      case 'lawyer':
        return <FaUserTie className="h-4 w-4 text-green-600" />;
      case 'admin':
        return <FaUserShield className="h-4 w-4 text-red-600" />;
      default:
        return <FaUser className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'user':
        return 'border-blue-200 hover:bg-blue-50';
      case 'lawyer':
        return 'border-green-200 hover:bg-green-50';
      case 'admin':
        return 'border-red-200 hover:bg-red-50';
      default:
        return 'border-gray-200 hover:bg-gray-50';
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="relative inline-block">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-white border-2 ${getRoleColor()} rounded-lg shadow-sm transition-all duration-200 hover:shadow-md`}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {currentUser.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900 truncate max-w-24">
            {currentUser.name}
          </p>
          <p className="text-xs text-gray-500 capitalize">{userRole}</p>
        </div>
        <FaChevronDown 
          className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {getRoleIcon()}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{currentUser.name}</p>
                  <p className="text-xs text-gray-600">{currentUser.email}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    {userRole} Account
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleDashboard}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaTachometerAlt className="h-4 w-4 text-gray-400" />
                Go to Dashboard
              </button>
              
              {userRole !== 'admin' && (
                <button
                  onClick={() => {
                    navigate('/my-profile');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaUser className="h-4 w-4 text-gray-400" />
                  My Profile
                </button>
              )}
              
              <hr className="my-2 border-gray-100" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt className="h-4 w-4 text-red-500" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserStatus;
