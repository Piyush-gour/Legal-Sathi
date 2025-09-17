import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, lawyer, userLogout, lawyerLogout, getUserRole } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const currentUser = user || lawyer;
  const userRole = getUserRole();

  const logout = () => {
    if (userRole === 'user') {
      userLogout();
    } else if (userRole === 'lawyer') {
      lawyerLogout();
    }
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden lg:flex items-center gap-4 font-medium text-xs">
        <NavLink to="/">
          <li className="py-1 px-2">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-[#5F6FFF]  w-3/5 m-auto hidden" />
        </NavLink>
        
        {/* Navigation for Users */}
        {(!currentUser || userRole === 'user') && (
          <>
            <NavLink to="/talk-to-lawyer">
              <li className="py-1 px-2">TALK TO LAWYER</li>
              <hr className="border-none outline-none h-0.5 bg-[#5F6FFF]  w-3/5 m-auto hidden" />
            </NavLink>
            <NavLink to="/lawyers">
              <li className="py-1 px-2">FIND LAWYER</li>
              <hr className="border-none outline-none h-0.5 bg-[#5F6FFF]  w-3/5 m-auto hidden" />
            </NavLink>
            <NavLink to="/ipc-section">
              <li className="py-1 px-2">IPC SECTION</li>
              <hr className="border-none outline-none h-0.5 bg-[#5F6FFF]  w-3/5 m-auto hidden" />
            </NavLink>
            <NavLink to="/legal-advice">
              <li className="py-1 px-2">LEGAL ADVICE</li>
              <hr className="border-none outline-none h-0.5 bg-[#5F6FFF]  w-3/5 m-auto hidden" />
            </NavLink>
          </>
        )}
        
        {/* Navigation for Lawyers */}
        {userRole === 'lawyer' && (
          <>
            <NavLink to="/lawyer-dashboard">
              <li className="py-1 px-2">DASHBOARD</li>
              <hr className="border-none outline-none h-0.5 bg-[#5F6FFF]  w-3/5 m-auto hidden" />
            </NavLink>
            <NavLink to="/consultation-requests">
              <li className="py-1 px-2">CONSULTATIONS</li>
              <hr className="border-none outline-none h-0.5 bg-[#5F6FFF]  w-3/5 m-auto hidden" />
            </NavLink>
            <NavLink to="/my-clients">
              <li className="py-1 px-2">MY CLIENTS</li>
              <hr className="border-none outline-none h-0.5 bg-[#5F6FFF]  w-3/5 m-auto hidden" />
            </NavLink>
            <NavLink to="/earnings">
              <li className="py-1 px-2">EARNINGS</li>
              <hr className="border-none outline-none h-0.5 bg-[#5F6FFF]  w-3/5 m-auto hidden" />
            </NavLink>
          </>
        )}
        
        {/* Common Links */}
        <NavLink to="/contact">
          <li className="py-1 px-2">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-[#5F6FFF]  w-3/5 m-auto hidden" />
        </NavLink>
        
        <button
          onClick={() => navigate('/admin-login')}
          className="py-1 bg-red-600 text-white px-4 rounded hover:bg-red-700 ml-2"
        >
          ADMIN
        </button>
      </ul>
      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={currentUser.image || assets.profile_pic} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                {/* User Role Header */}
                <div className="border-b pb-2 mb-2">
                  <p className="text-xs text-gray-500 uppercase">
                    {userRole === 'user' ? 'Client Account' : 'Lawyer Account'}
                  </p>
                  <p className="font-semibold text-sm">{currentUser.name}</p>
                </div>
                
                <p
                  onClick={() => navigate(userRole === 'user' ? '/user-dashboard' : '/lawyer-dashboard')}
                  className="hover:text-black cursor-pointer"
                >
                  Dashboard
                </p>
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                
                {/* User-specific menu items */}
                {userRole === 'user' && (
                  <>
                    <p
                      onClick={() => navigate("/my-consultations")}
                      className="hover:text-black cursor-pointer"
                    >
                      My Consultations
                    </p>
                    <p
                      onClick={() => navigate("/lawyers")}
                      className="hover:text-black cursor-pointer"
                    >
                      Find Lawyers
                    </p>
                  </>
                )}
                
                {/* Lawyer-specific menu items */}
                {userRole === 'lawyer' && (
                  <>
                    <p
                      onClick={() => navigate("/consultation-requests")}
                      className="hover:text-black cursor-pointer"
                    >
                      Consultation Requests
                    </p>
                    <p
                      onClick={() => navigate("/my-clients")}
                      className="hover:text-black cursor-pointer"
                    >
                      My Clients
                    </p>
                    <p
                      onClick={() => navigate("/earnings")}
                      className="hover:text-black cursor-pointer"
                    >
                      Earnings & Reports
                    </p>
                    <p
                      onClick={() => navigate("/availability-settings")}
                      className="hover:text-black cursor-pointer"
                    >
                      Availability Settings
                    </p>
                  </>
                )}
                
                <hr className="border-gray-300" />
                <p onClick={logout} className="hover:text-black cursor-pointer text-red-600">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex gap-2 ml-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              User Login
            </button>
            <button
              onClick={() => navigate("/lawyer-login")}
              className="bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Lawyer Login
            </button>
          </div>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        {/* ---------- Mobile Menu ---------- */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} className='py-1 px-3 rounded inline-block' to='/'>HOME</NavLink>
            
            {/* Mobile menu for Users */}
            {(!currentUser || userRole === 'user') && (
              <>
                <NavLink onClick={() => setShowMenu(false)} to="/talk-to-lawyer">
                  <p className="px-4 py-2 rounded inline-block">TALK TO LAWYER</p>
                </NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/lawyers">
                  <p className="px-4 py-2 rounded inline-block">FIND LAWYER</p>
                </NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/ipc-section">
                  <p className="px-4 py-2 rounded inline-block">IPC SECTION</p>
                </NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/legal-advice">
                  <p className="px-4 py-2 rounded inline-block">LEGAL ADVICE</p>
                </NavLink>
              </>
            )}
            
            {/* Mobile menu for Lawyers */}
            {userRole === 'lawyer' && (
              <>
                <NavLink onClick={() => setShowMenu(false)} to="/lawyer-dashboard">
                  <p className="px-4 py-2 rounded inline-block">DASHBOARD</p>
                </NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/consultation-requests">
                  <p className="px-4 py-2 rounded inline-block">CONSULTATIONS</p>
                </NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/my-clients">
                  <p className="px-4 py-2 rounded inline-block">MY CLIENTS</p>
                </NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/earnings">
                  <p className="px-4 py-2 rounded inline-block">EARNINGS</p>
                </NavLink>
              </>
            )}
            
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>
            
            {currentUser ? (
              <>
                <NavLink onClick={() => setShowMenu(false)} to={userRole === 'user' ? '/user-dashboard' : '/lawyer-dashboard'}>
                  <p className="px-4 py-2 rounded inline-block bg-blue-600 text-white hover:bg-blue-700">MY DASHBOARD</p>
                </NavLink>
                {userRole === 'user' && (
                  <NavLink onClick={() => setShowMenu(false)} to="/my-consultations">
                    <p className="px-4 py-2 rounded inline-block">MY CONSULTATIONS</p>
                  </NavLink>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    logout();
                  }}
                  className="px-4 py-2 rounded inline-block bg-red-600 text-white hover:bg-red-700 text-left w-full"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <NavLink onClick={() => setShowMenu(false)} className='py-1 px-3 rounded inline-block bg-blue-600 text-white hover:bg-blue-700' to='/login'>USER LOGIN</NavLink>
                <NavLink onClick={() => setShowMenu(false)} className='py-1 px-3 rounded inline-block bg-green-600 text-white hover:bg-green-700' to='/lawyer-login'>LAWYER LOGIN</NavLink>
              </>
            )}
            <button
              onClick={() => {
                setShowMenu(false);
                navigate('/admin-login');
              }}
              className="py-1 px-3 rounded inline-block bg-red-600 text-white hover:bg-red-700"
            >
              ADMIN
            </button>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;