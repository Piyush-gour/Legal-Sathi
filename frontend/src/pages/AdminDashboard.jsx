import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../assets/assets';
import { FaUsers, FaUserTie, FaCalendarAlt, FaMoneyBillWave, FaCheck, FaTimes, FaEye, FaTachometerAlt, FaCog, FaSignOutAlt, FaChartBar, FaBell } from 'react-icons/fa';

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
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [users, setUsers] = useState([]);
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
      const statsResponse = await axios.get(`${backendUrl}/api/admin/stats`, { headers });
      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      // Fetch lawyers
      const lawyersResponse = await axios.get(`${backendUrl}/api/admin/lawyers`, { headers });
      if (lawyersResponse.data.success) {
        setLawyers(lawyersResponse.data.lawyers);
      }

      // Fetch pending lawyers
      const pendingLawyersResponse = await axios.get(`${backendUrl}/api/admin/pending-lawyers`, { headers });
      if (pendingLawyersResponse.data.success) {
        // The API returns 'lawyers' but let's check both for compatibility
        const pendingLawyersData = pendingLawyersResponse.data.lawyers || pendingLawyersResponse.data.pendingLawyers || [];
        setPendingLawyers(pendingLawyersData);
      }

      // Fetch users
      const usersResponse = await axios.get(`${backendUrl}/api/admin/users`, { headers });
      if (usersResponse.data.success) {
        setUsers(usersResponse.data.users);
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
      const endpoint = status === 'approved' ? 'approve-lawyer' : 'reject-lawyer';
      const response = await axios.post(
        `${backendUrl}/api/admin/${endpoint}`,
        { lawyerId },
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

  const handleUserBlock = async (userId, isBlocked) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${backendUrl}/api/admin/users/${userId}/block`,
        { isBlocked: !isBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`User ${!isBlocked ? 'blocked' : 'unblocked'} successfully`);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${backendUrl}/api/admin/appointment-action`,
        { appointmentId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Appointment ${action}d successfully`);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      toast.error(`Failed to ${action} appointment`);
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <img src={assets.admin_logo} alt="Legal Sathi Admin" className="h-10 w-auto" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {[
              { key: 'overview', label: 'Dashboard', icon: FaTachometerAlt },
              { key: 'lawyers', label: 'Lawyers', icon: FaUserTie },
              { key: 'appointments', label: 'Appointments', icon: FaCalendarAlt },
              { key: 'users', label: 'Users', icon: FaUsers },
              { key: 'analytics', label: 'Analytics', icon: FaChartBar },
              { key: 'settings', label: 'Settings', icon: FaCog }
            ].map((item) => (
              <div key={item.key} className="mb-1">
                <button
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.key
                      ? 'bg-red-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </div>
            ))}
          </div>
        </nav>

        {/* Admin Profile Section */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {(admin?.name || 'Admin').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-gray-900 font-medium text-sm">{admin?.name || 'Admin'}</p>
              <p className="text-gray-500 text-xs">{admin?.email || 'admin@legalsathi.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <FaSignOutAlt className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'lawyers' && 'Lawyer Management'}
                {activeTab === 'appointments' && 'Appointment Management'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'analytics' && 'Analytics & Reports'}
                {activeTab === 'settings' && 'System Settings'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {activeTab === 'overview' && 'Monitor your platform\'s key metrics and performance'}
                {activeTab === 'lawyers' && 'Manage lawyer registrations, approvals, and profiles'}
                {activeTab === 'appointments' && 'View and manage all appointments and consultations'}
                {activeTab === 'users' && 'Manage user accounts and permissions'}
                {activeTab === 'analytics' && 'View detailed analytics and generate reports'}
                {activeTab === 'settings' && 'Configure system settings and preferences'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('lawyers')}
                className="p-2 text-gray-400 hover:text-gray-600 relative"
                title={`${pendingLawyers?.length || 0} pending approvals`}
              >
                <FaBell className="h-5 w-5" />
                {pendingLawyers && pendingLawyers.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {pendingLawyers.length}
                  </span>
                )}
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
            
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
                        <dd className="text-lg font-medium text-gray-900">{users?.length || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaBell className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Approvals</dt>
                        <dd className="text-lg font-medium text-gray-900">{pendingLawyers?.length || 0}</dd>
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
                        <dd className="text-lg font-medium text-gray-900">{lawyers?.length || 0}</dd>
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
                        <dd className="text-lg font-medium text-gray-900">{appointments?.length || 0}</dd>
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
            <div className="space-y-6">
              
              {/* Pending Lawyers Section */}
              {pendingLawyers && pendingLawyers.length > 0 && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <FaBell className="h-5 w-5 text-yellow-600 mr-2" />
                      Pending Lawyer Approvals ({pendingLawyers.length})
                    </h3>
                    <p className="text-sm text-gray-600">New lawyer registrations waiting for approval</p>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {pendingLawyers.map((lawyer) => (
                      <li key={lawyer._id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              className="h-12 w-12 rounded-full object-cover"
                              src={lawyer.image || '/default-avatar.png'}
                              alt=""
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{lawyer.name}</div>
                              <div className="text-sm text-gray-500">{lawyer.email}</div>
                              <div className="text-sm text-gray-500">{lawyer.practiceArea}</div>
                              <div className="text-xs text-gray-400">
                                Experience: {lawyer.experience} years | Fees: ₹{lawyer.fees}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                            <button
                              onClick={() => handleLawyerApproval(lawyer._id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleLawyerApproval(lawyer._id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Approved Lawyers Section */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Approved Lawyers ({lawyers?.length || 0})</h3>
                  <p className="text-sm text-gray-500">All approved and active lawyers</p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {lawyers && lawyers.map((lawyer) => (
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
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">All Appointments ({appointments?.length || 0})</h3>
                  <p className="text-sm text-gray-500">Manage all appointments and consultations</p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {appointments && appointments.map((appointment) => (
                    <li key={appointment._id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.userName} → {appointment.lawyerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(appointment.slotDate).toLocaleDateString()} at {appointment.slotTime}
                          </div>
                          <div className="text-sm text-gray-500">₹{appointment.amount}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            ID: {appointment._id}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.cancelled
                              ? 'bg-red-100 text-red-800'
                              : appointment.isCompleted
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Scheduled'}
                          </span>
                          {!appointment.cancelled && !appointment.isCompleted && (
                            <>
                              <button
                                onClick={() => handleAppointmentAction(appointment._id, 'complete')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => handleAppointmentAction(appointment._id, 'cancel')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          <button className="text-blue-600 hover:text-blue-900">
                            <FaEye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {(!appointments || appointments.length === 0) && (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No appointments found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Registered Users ({users?.length || 0})</h3>
                  <p className="text-sm text-gray-500">All registered users on the platform</p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {users && users.map((user) => (
                    <li key={user._id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.image || '/default-avatar.png'}
                            alt=""
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">
                              Joined: {new Date(user.createdAt || user.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isBlocked 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                          <button 
                            onClick={() => handleUserBlock(user._id, user.isBlocked)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              user.isBlocked 
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            <FaEye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {(!users || users.length === 0) && (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No users registered yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FaChartBar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Registration Rate</dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {users && lawyers ? ((users.length + lawyers.length) / 30).toFixed(1) : 0} per day
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FaCalendarAlt className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {appointments ? 
                              `${((appointments.filter(a => a.isCompleted).length / appointments.length) * 100 || 0).toFixed(1)}%`
                              : '0%'
                            }
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FaBell className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Approval Rate</dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {lawyers && pendingLawyers ? 
                              `${((lawyers.length / (lawyers.length + pendingLawyers.length)) * 100 || 0).toFixed(1)}%`
                              : '0%'
                            }
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-500">Latest platform activities and registrations</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {pendingLawyers && pendingLawyers.slice(0, 5).map((lawyer) => (
                      <div key={lawyer._id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                        <FaUserTie className="h-5 w-5 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            New lawyer registration: {lawyer.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {lawyer.practiceArea} • Awaiting approval
                          </p>
                        </div>
                        <span className="text-xs text-yellow-600 font-medium">Pending</span>
                      </div>
                    ))}
                    
                    {users && users.slice(-3).map((user) => (
                      <div key={user._id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <FaUsers className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            New user registration: {user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                        <span className="text-xs text-blue-600 font-medium">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Platform Settings */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Platform Settings</h3>
                  <p className="text-sm text-gray-500">Configure platform-wide settings</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Auto-approve lawyers</h4>
                      <p className="text-sm text-gray-500">Automatically approve new lawyer registrations</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email notifications</h4>
                      <p className="text-sm text-gray-500">Send email notifications for new registrations</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-red-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Maintenance mode</h4>
                      <p className="text-sm text-gray-500">Put the platform in maintenance mode</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">System Information</h3>
                  <p className="text-sm text-gray-500">Current system status and information</p>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Platform Version</dt>
                      <dd className="mt-1 text-sm text-gray-900">Legal Sathi v1.0.0</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Database Status</dt>
                      <dd className="mt-1 text-sm text-green-600 font-medium">Connected</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Backup</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Server Status</dt>
                      <dd className="mt-1 text-sm text-green-600 font-medium">Online</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Admin Actions</h3>
                  <p className="text-sm text-gray-500">Administrative actions and utilities</p>
                </div>
                <div className="p-6 space-y-4">
                  <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Export User Data
                  </button>
                  <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium ml-0 sm:ml-3">
                    Generate Reports
                  </button>
                  <button className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium ml-0 sm:ml-3">
                    Clear Cache
                  </button>
                  <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium ml-0 sm:ml-3">
                    System Backup
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
