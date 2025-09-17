import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LawyerConsultationCard from '../components/LawyerConsultationCard';
import LawyerStats from '../components/LawyerStats';

const LawyerDashboard = () => {
  const { lawyer, logoutLawyer, token: lawyerToken } = useAuth();
  const navigate = useNavigate();
  const [consultationRequests, setConsultationRequests] = useState([]);
  const [profile, setProfile] = useState({
    name: lawyer?.name || '',
    email: lawyer?.email || '',
    phone: lawyer?.phone || '',
    specialization: lawyer?.specialization || '',
    practiceArea: lawyer?.practiceArea || '',
    experience: lawyer?.experience || '',
    consultationFees: lawyer?.consultationFees || '',
    about: lawyer?.about || '',
    available: lawyer?.available || true
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    fetchConsultationRequests();
    fetchLawyerProfile();
  }, []);

  const fetchConsultationRequests = async () => {
    try {
      const currentToken = localStorage.getItem('lawyerToken');
      if (!currentToken) {
        console.log('No lawyer token found');
        return;
      }
      
      const cleanToken = currentToken.replace(/['"]/g, '').trim();
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/lawyer/consultation-requests`, {
        headers: { 
          Authorization: `Bearer ${cleanToken}`,
          token: cleanToken
        }
      });
      if (response.data.success) {
        const sortedRequests = response.data.requests.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (b.status === 'pending' && a.status !== 'pending') return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setConsultationRequests(sortedRequests);
      }
    } catch (error) {
      console.error('Error fetching consultation requests:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load consultation requests';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchLawyerProfile = async () => {
    try {
      const currentToken = localStorage.getItem('lawyerToken');
      if (!currentToken) return;
      
      const cleanToken = currentToken.replace(/['"]/g, '').trim();
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/lawyer/profile`, {
        headers: { 
          Authorization: `Bearer ${cleanToken}`,
          token: cleanToken
        }
      });
      
      if (response.data.success) {
        setProfile(response.data.lawyer);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const currentToken = localStorage.getItem('lawyerToken');
      if (!currentToken) return;
      
      const cleanToken = currentToken.replace(/['"]/g, '').trim();
      const endpoint = action === 'accept' ? 'consultation-request/accept' : 'consultation-request/reject';
      
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/lawyer/${endpoint}`, 
        { requestId },
        {
          headers: { 
            Authorization: `Bearer ${cleanToken}`,
            token: cleanToken
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Consultation request ${action}ed successfully`);
        fetchConsultationRequests();
      } else {
        toast.error(response.data.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`Failed to ${action} request`);
    }
  };

  const joinConsultation = (consultation, type) => {
    const consultationId = consultation._id || consultation.id;
    
    switch(type) {
      case 'video':
        navigate(`/video-call/${consultationId}`);
        break;
      case 'audio':
        navigate(`/audio-call/${consultationId}`);
        break;
      case 'chat':
        navigate(`/chat-consultation/${consultationId}`);
        break;
      default:
        navigate(`/chat-consultation/${consultationId}`);
    }
  };

  const toggleAvailability = async () => {
    try {
      const currentToken = localStorage.getItem('lawyerToken');
      if (!currentToken) return;
      
      const cleanToken = currentToken.replace(/['"]/g, '').trim();
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/lawyer/toggle-availability`, 
        {},
        {
          headers: { 
            Authorization: `Bearer ${cleanToken}`,
            token: cleanToken
          }
        }
      );
      
      if (response.data.success) {
        setProfile(prev => ({ ...prev, available: !prev.available }));
        toast.success(`Availability ${profile.available ? 'disabled' : 'enabled'}`);
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const currentToken = localStorage.getItem('lawyerToken');
      if (!currentToken) return;
      
      const cleanToken = currentToken.replace(/['"]/g, '').trim();
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/lawyer/profile`, 
        profile,
        {
          headers: { 
            Authorization: `Bearer ${cleanToken}`,
            token: cleanToken
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logoutLawyer();
    navigate('/lawyer-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderConsultationRequests = () => (
    <div className="space-y-4">
      <LawyerStats consultations={consultationRequests} />
      {consultationRequests.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No consultation requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {consultationRequests.map((request) => (
            <LawyerConsultationCard
              key={request._id}
              consultation={request}
              onAccept={(id) => handleRequestAction(id, 'accept')}
              onReject={(id) => handleRequestAction(id, 'reject')}
              onJoin={joinConsultation}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderProfileTab = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Profile Management</h2>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            profile.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {profile.available ? 'Available' : 'Unavailable'}
          </span>
          <button
            onClick={toggleAvailability}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              profile.available 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {profile.available ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>
      
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Practice Area</label>
            <select
              value={profile.practiceArea}
              onChange={(e) => setProfile({...profile, practiceArea: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Practice Area</option>
              <option value="Corporate Law">Corporate Law</option>
              <option value="Criminal Law">Criminal Law</option>
              <option value="Family Law">Family Law</option>
              <option value="Real Estate Law">Real Estate Law</option>
              <option value="Employment Law">Employment Law</option>
              <option value="Immigration Law">Immigration Law</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
            <input
              type="number"
              value={profile.experience}
              onChange={(e) => setProfile({...profile, experience: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fees (₹)</label>
            <input
              type="number"
              value={profile.consultationFees}
              onChange={(e) => setProfile({...profile, consultationFees: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
          <textarea
            value={profile.about}
            onChange={(e) => setProfile({...profile, about: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell clients about your expertise and experience..."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Update Profile
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lawyer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
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
              Profile Management
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

export default LawyerDashboard;
