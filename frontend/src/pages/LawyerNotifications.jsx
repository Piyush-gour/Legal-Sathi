import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LawyerNotifications = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadAppointments, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadAppointments = () => {
    try {
      const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const pendingAppointments = allAppointments.filter(apt => apt.status === 'pending');
      setAppointments(pendingAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = (appointmentId, action) => {
    try {
      const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const updatedAppointments = allAppointments.map(apt => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            status: action,
            respondedAt: new Date().toISOString()
          };
        }
        return apt;
      });

      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      
      const appointment = updatedAppointments.find(apt => apt.id === appointmentId);
      
      if (action === 'accepted') {
        toast.success(`Appointment with ${appointment.userName} accepted!`);
        
        // Start video call immediately
        setTimeout(() => {
          navigate(`/video-consultation/${appointment.lawyerId}`, {
            state: {
              appointment: appointment,
              fromLawyerAcceptance: true,
              autoStart: true
            }
          });
        }, 1500);
      } else {
        toast.info(`Appointment with ${appointment.userName} declined`);
      }
      
      loadAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getConsultationIcon = (type) => {
    switch (type) {
      case 'video': return '📹';
      case 'audio': return '📞';
      case 'chat': return '💬';
      default: return '📹';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointment Requests</h1>
              <p className="text-gray-600">Manage incoming consultation requests</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {appointments.length} Pending
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending requests</h3>
            <p className="text-gray-600">New appointment requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Client Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">👤</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.userName}
                        </h3>
                        <p className="text-sm text-gray-600">{appointment.userEmail}</p>
                        {appointment.userPhone && (
                          <p className="text-sm text-gray-600">{appointment.userPhone}</p>
                        )}
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">📅</span>
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium">{formatDate(appointment.selectedDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">⏰</span>
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium">{appointment.selectedTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{getConsultationIcon(appointment.consultationType)}</span>
                        <div>
                          <p className="text-sm text-gray-600">Type</p>
                          <p className="font-medium capitalize">{appointment.consultationType}</p>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    {appointment.message && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Client Message:</p>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-800">{appointment.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Request Time */}
                    <p className="text-xs text-gray-500">
                      Requested {new Date(appointment.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => handleAppointmentAction(appointment.id, 'accepted')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      ✅ Accept & Start Call
                    </button>
                    <button
                      onClick={() => handleAppointmentAction(appointment.id, 'declined')}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      ❌ Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span>Auto-refreshing every 10 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerNotifications;
