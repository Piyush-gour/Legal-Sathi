import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logoutUser, token: userToken } = useAuth();
  const navigate = useNavigate();
  const [consultationRequests, setConsultationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    if (user && userToken) {
      fetchConsultationRequests();
      fetchUserProfile();
    }
  }, [user, userToken]);

  const fetchConsultationRequests = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/consultations`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      
      if (response.data.success) {
        setConsultationRequests(response.data.consultations || []);
      } else {
        setConsultationRequests([]);
      }
    } catch (error) {
      console.error('Error fetching consultation requests:', error);
      setConsultationRequests([]);
      toast.error('Failed to fetch consultation requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      
      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/update-profile`, profile, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const joinConsultation = (consultationId, type) => {
    if (type === 'video') {
      navigate(`/video-call/${consultationId}`);
    } else if (type === 'audio') {
      navigate(`/audio-call/${consultationId}`);
    } else if (type === 'chat') {
      navigate(`/chat/${consultationId}`);
    }
  };

  const renderConsultationRequests = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Consultation Requests</h2>
          <button
            onClick={() => navigate('/lawyers')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Book New Consultation
          </button>
        </div>

        {consultationRequests && consultationRequests.length > 0 ? (
          <div className="space-y-4">
            {consultationRequests.map(request => (
              <div key={request._id} className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">⚖️</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.lawyerName}</h3>
                        <p className="text-sm text-gray-600">{request.lawyerEmail}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.consultationType === 'video' ? 'bg-green-100 text-green-800' :
                        request.consultationType === 'audio' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {request.consultationType === 'video' ? '📹 Video Call' :
                         request.consultationType === 'audio' ? '📞 Audio Call' :
                         '💬 Chat'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{request.message}</p>
                    <p className="text-sm text-gray-500">
                      Requested: {new Date(request.createdAt).toLocaleString()}
                    </p>
                    {request.selectedDate && request.selectedTime && (
                      <p className="text-sm text-gray-600">
                        Scheduled: {new Date(request.selectedDate).toLocaleDateString()} at {request.selectedTime}
                      </p>
                    )}
                  </div>
                  
                  {request.status === 'accepted' && (
                    <div className="ml-4">
                      <button
                        onClick={() => joinConsultation(request._id, request.consultationType)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Join Consultation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Consultation Requests</h3>
            <p className="text-gray-500 mb-4">You haven't made any consultation requests yet.</p>
            <button
              onClick={() => navigate('/lawyers')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Find Lawyers
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
      
      <form onSubmit={updateProfile} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
            <p className="text-gray-600 mt-1">Manage your legal consultations and profile</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-500">User Dashboard</p>
            <p className="text-lg font-semibold text-blue-600">{consultationRequests.length} Active Requests</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-4 sm:px-6">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Consultation Requests
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'requests' && renderConsultationRequests()}
        {activeTab === 'profile' && renderProfileTab()}
      </div>
    </div>
  );
};

export default UserDashboard;
