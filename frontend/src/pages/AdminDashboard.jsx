import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../assets/assets';
import { FaUsers, FaUserTie, FaCalendarAlt, FaMoneyBillWave, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const AdminDashboard = () => {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalAppointments: 0,
    totalEarnings: 0
  });
  
  const [lawyers, setLawyers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin) {
      navigate('/admin-login');
      return;
    }
    fetchDashboardData();
  }, [admin, navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch dashboard stats
      const statsResponse = await axios.get(`${backendUrl}/api/admin/dashboard-stats`, { headers });
      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      // Fetch lawyers
      const lawyersResponse = await axios.get(`${backendUrl}/api/admin/lawyers`, { headers });
      if (lawyersResponse.data.success) {
        setLawyers(lawyersResponse.data.lawyers);
      }

      // Fetch appointments
      const appointmentsResponse = await axios.get(`${backendUrl}/api/admin/appointments`, { headers });
      if (appointmentsResponse.data.success) {
        setAppointments(appointmentsResponse.data.appointments);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLawyerApproval = async (lawyerId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${backendUrl}/api/admin/lawyer-approval`,
        { lawyerId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Lawyer ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to update lawyer status');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
    toast.success('Admin logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src={assets.logo} alt="Legal Sathi" className="h-10 w-auto mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Legal Sathi Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {admin?.name || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['overview', 'lawyers', 'appointments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaUsers className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaUserTie className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Lawyers</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalLawyers}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaCalendarAlt className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalAppointments}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaMoneyBillWave className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                        <dd className="text-lg font-medium text-gray-900">₹{stats.totalEarnings}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lawyers' && (
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Lawyer Management</h2>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {lawyers.map((lawyer) => (
                  <li key={lawyer._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={lawyer.image || '/default-avatar.png'}
                          alt=""
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{lawyer.name}</div>
                          <div className="text-sm text-gray-500">{lawyer.email}</div>
                          <div className="text-sm text-gray-500">{lawyer.practiceArea}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          lawyer.isApproved === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : lawyer.isApproved === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {lawyer.isApproved || 'pending'}
                        </span>
                        {lawyer.isApproved === 'pending' && (
                          <>
                            <button
                              onClick={() => handleLawyerApproval(lawyer._id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FaCheck className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleLawyerApproval(lawyer._id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTimes className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">
                          <FaEye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Appointment Management</h2>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <li key={appointment._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.userName} → {appointment.lawyerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(appointment.slotDate).toLocaleDateString()} at {appointment.slotTime}
                        </div>
                        <div className="text-sm text-gray-500">₹{appointment.amount}</div>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.cancelled
                          ? 'bg-red-100 text-red-800'
                          : appointment.isCompleted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Scheduled'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
