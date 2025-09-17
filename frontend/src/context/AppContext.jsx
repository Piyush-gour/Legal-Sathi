import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { lawyers as lawyersData } from "../assets/assets";
import { useAuth } from "./AuthContext";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹"; // Changed to Indian Rupee since this is Legal Sathi
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [lawyers, setLawyers] = useState([]);
  const [doctors, setDoctors] = useState([]); // For compatibility with existing components
  const [token, setToken] = useState(
    localStorage.getItem("userToken") ? localStorage.getItem("userToken") : false
  );
  const [userData, setUserData] = useState({});
  
  // Update token when localStorage changes (when user logs in/out)
  useEffect(() => {
    const handleStorageChange = () => {
      const userToken = localStorage.getItem("userToken");
      setToken(userToken || false);
    };
    
    const handleUserLogin = () => {
      const userToken = localStorage.getItem("userToken");
      setToken(userToken || false);
    };
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom login event
    window.addEventListener('userLoggedIn', handleUserLogin);
    
    // Also check periodically for token changes
    const interval = setInterval(() => {
      const userToken = localStorage.getItem("userToken");
      if (userToken !== token) {
        setToken(userToken || false);
      }
    }, 500); // Reduced interval for faster sync
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleUserLogin);
      clearInterval(interval);
    };
  }, [token]);

  const getLawyersData = async () => {
    try {
      // Fetch only admin-approved lawyers from backend API
      const { data } = await axios.get(`${backendUrl}/api/user/lawyers`);
      console.log("API Response:", data);
      
      if (data.success && data.lawyers && data.lawyers.length > 0) {
        console.log("Loaded lawyers from API:", data.lawyers.length);
        // Filter only approved and available lawyers
        const availableLawyers = data.lawyers.filter(lawyer => 
          lawyer.approved === true && lawyer.available !== false
        );
        console.log("Available approved lawyers:", availableLawyers.length);
        setLawyers(availableLawyers);
        
        if (availableLawyers.length === 0) {
          toast.info("No lawyers are currently available. Please try again later.");
        }
      } else {
        console.log("No approved lawyers found in database");
        setLawyers([]);
        toast.error("No lawyers available. Please contact admin.");
      }
    } catch (error) {
      console.log("Error loading lawyers from API:", error.message);
      setLawyers([]);
      toast.error("Failed to connect to server. Please check your internet connection.");
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { 
          Authorization: `Bearer ${token}`,
          token: token 
        },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // For compatibility - doctors are the same as lawyers in this app
  const getDoctorsData = getLawyersData;
  
  // Method to refresh token from localStorage
  const refreshToken = () => {
    const userToken = localStorage.getItem("userToken");
    setToken(userToken || false);
  };
  
  const value = {
    lawyers,
    doctors: lawyers, // For compatibility with existing appointment system
    getLawyersData,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    refreshToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };

  useEffect(() => {
    getLawyersData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData({}); 
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
