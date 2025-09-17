import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";
import LawyerRegistration from "./LawyerRegistration";

const LawyerLogin = () => {
  const navigate = useNavigate();
  const { lawyerLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/lawyer/login`, {
        email: formData.email,
        password: formData.password
      });

      const data = response.data;

      if (data.success) {
        lawyerLogin(data.token, data.lawyer);
        toast.success("Login successful!");
        navigate('/lawyer-dashboard');
      } else {
        if (data.message && data.message.includes("Invalid credentials")) {
          toast.error("Invalid email or password. If you don't have an account, please register below.");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 404 || error.response?.data?.message?.includes("not found")) {
        toast.error("Account not found. Please register as a new lawyer.");
      } else {
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showRegistration) {
    return <LawyerRegistration onBackToLogin={() => setShowRegistration(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src={assets.logo} alt="Legal Sathi" className="h-16 w-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Lawyer Portal</h2>
          <p className="text-gray-600">Sign in to your legal practice account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your registered email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-500 transition duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In to Practice Portal"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">New to Legal Sathi?</p>
              <div className="mt-4">
                <button
                  onClick={() => setShowRegistration(true)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium"
                >
                  Register as a Lawyer
                </button>
              </div>
            </div>
          </div>

          {/* Client Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Looking for client services?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-500 font-medium transition duration-200"
              >
                Client Login
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Lawyer Portal Features
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Manage client consultations
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Video, chat & phone consultations
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Track earnings and analytics
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Update availability and profile
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="text-center text-xs text-gray-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
          <p className="mt-1">Legal Sathi - Connecting Justice with Technology</p>
        </div>
      </div>
    </div>
  );
};

export default LawyerLogin;
