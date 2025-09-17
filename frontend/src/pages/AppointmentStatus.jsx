import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const AppointmentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appointment, setAppointment] = useState(location.state?.appointment || null);
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState(location.state?.message || '');

  useEffect(() => {
    if (!appointment) {
      navigate('/lawyers');
      return;
    }

    // Check for status updates every 5 seconds
    const interval = setInterval(() => {
      checkAppointmentStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [appointment]);

  const checkAppointmentStatus = () => {
    if (!appointment) return;

    // Get updated appointment from localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointment = appointments.find(apt => apt.id === appointment.id);
    
    if (updatedAppointment && updatedAppointment.status !== status) {
      setStatus(updatedAppointment.status);
      setAppointment(updatedAppointment);
      
      if (updatedAppointment.status === 'accepted') {
        toast.success('Appointment accepted! Starting video call...');
        setTimeout(() => {
          navigate(`/video-consultation/${updatedAppointment.lawyerId}`, {
            state: {
              appointment: updatedAppointment,
              fromAcceptedAppointment: true
            }
          });
        }, 2000);
      } else if (updatedAppointment.status === 'declined') {
        toast.error('Appointment was declined by the lawyer');
        setMessage('The lawyer has declined your appointment request. You can try booking with another lawyer or choose a different time slot.');
      }
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✅';
      case 'declined':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'accepted':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declined':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No appointment found</h2>
          <button
            onClick={() => navigate('/lawyers')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Browse Lawyers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/lawyers')}
              className="text-gray-600 hover:text-gray-800 text-2xl"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointment Status</h1>
              <p className="text-gray-600">Track your consultation request</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className={`border rounded-lg p-6 ${getStatusColor()}`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{getStatusIcon()}</div>
              <div>
                <h2 className="text-xl font-semibold capitalize">{status}</h2>
                <p className="text-sm opacity-75">
                  {status === 'pending' && 'Waiting for lawyer response'}
                  {status === 'accepted' && 'Appointment confirmed!'}
                  {status === 'declined' && 'Appointment declined'}
                </p>
              </div>
            </div>
            
            {message && (
              <p className="text-sm">{message}</p>
            )}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Lawyer:</span>
              <span className="font-medium">{appointment.lawyerName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date(appointment.selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{appointment.selectedTime}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium capitalize">
                {appointment.consultationType === 'video' ? '📹 Video Call' : 
                 appointment.consultationType === 'audio' ? '📞 Audio Call' : 
                 '💬 Chat'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Your Name:</span>
              <span className="font-medium">{appointment.userName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{appointment.userEmail}</span>
            </div>
            
            {appointment.message && (
              <div>
                <span className="text-gray-600 block mb-2">Message:</span>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{appointment.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status-specific Actions */}
        {status === 'pending' && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">What's happening now?</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Your request has been sent to {appointment.lawyerName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>Lawyer is reviewing your request</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>You'll be notified once they respond</span>
              </div>
            </div>
          </div>
        )}

        {status === 'accepted' && (
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h4 className="font-medium text-green-900 mb-2">Great news!</h4>
            <p className="text-sm text-green-800 mb-4">
              {appointment.lawyerName} has accepted your appointment. You will be redirected to the video call shortly.
            </p>
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              <span>Preparing video call...</span>
            </div>
          </div>
        )}

        {status === 'declined' && (
          <div className="bg-red-50 rounded-lg p-6 mb-6">
            <h4 className="font-medium text-red-900 mb-2">Appointment Declined</h4>
            <p className="text-sm text-red-800 mb-4">
              Unfortunately, {appointment.lawyerName} is not available at the requested time.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/book-appointment/${appointment.lawyerId}`, {
                  state: { lawyer: { _id: appointment.lawyerId, name: appointment.lawyerName } }
                })}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
              >
                Try Different Time
              </button>
              <button
                onClick={() => navigate('/lawyers')}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm"
              >
                Browse Other Lawyers
              </button>
            </div>
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span>Auto-refreshing status every 5 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentStatus;
