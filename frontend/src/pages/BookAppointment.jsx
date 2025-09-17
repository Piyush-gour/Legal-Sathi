import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lawyerId } = useParams();
  const { user, userToken } = useAuth();
  
  const [lawyer, setLawyer] = useState(location.state?.lawyer || null);
  const [consultationType, setConsultationType] = useState('video');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  // Generate next 7 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  useEffect(() => {
    if (!lawyer && lawyerId) {
      // Fetch lawyer info if not provided in state
      fetchLawyerInfo();
    }
    
    // Pre-fill user data when user context is available
    if (user) {
      setUserName(user.name || '');
      setUserEmail(user.email || '');
      setUserPhone(user.phone || '');
    }
  }, [lawyerId, lawyer, user]);

  const fetchLawyerInfo = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await axios.get(`${backendUrl}/api/lawyer/${lawyerId}`);
      
      if (response.data.success) {
        setLawyer(response.data.lawyer);
      } else {
        // Fallback to demo data if API fails
        setLawyer({
          _id: lawyerId,
          name: `Advocate ${lawyerId.substring(0, 8)}`,
          practiceArea: 'Legal Consultation',
          rating: 4.5,
          fees: 500,
          image: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`
        });
      }
    } catch (error) {
      console.error('Error fetching lawyer info:', error);
      // Fallback to demo data with professional lawyer image
      setLawyer({
        _id: lawyerId,
        name: `Advocate ${lawyerId.substring(0, 8)}`,
        practiceArea: 'Legal Consultation',
        rating: 4.5,
        fees: 500,
        image: `https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face`
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userName || !userEmail || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      if (!user || !userToken) {
        toast.error('Please login to book a consultation');
        navigate('/login');
        return;
      }

      // Create consultation request data
      const consultationData = {
        lawyerId: lawyer._id,
        consultationType,
        message,
        preferredTime: selectedTime,
        slotDate: selectedDate,
        userName,
        userEmail,
        userPhone
      };

      // Send to backend API
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await axios.post(`${backendUrl}/api/user/request-consultation`, consultationData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Consultation request sent successfully!');
      } else {
        toast.error(response.data.message || 'Failed to send consultation request');
        return;
      }
      
      // Navigate to user dashboard to see booked consultations
      navigate('/user-dashboard', { 
        state: { 
          successMessage: 'Your consultation request has been sent to the lawyer. You will be notified once they respond.',
          appointment: {
            id: Date.now().toString(),
            lawyerId: lawyer._id,
            lawyerName: `${lawyer.firstName} ${lawyer.lastName}`,
            lawyerSpecialty: lawyer.specialty,
            date: selectedDate,
            timeSlot: selectedTime,
            message,
            status: 'pending'
          }
        }
      });

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
              <p className="text-gray-600">Schedule a consultation with {lawyer.name}</p>
            </div>
          </div>
        </div>

        {/* Lawyer Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {lawyer.image ? (
                <img 
                  src={lawyer.image} 
                  alt={lawyer.name} 
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center ${lawyer.image ? 'hidden' : 'flex'}`}>
                <span className="text-2xl font-medium text-gray-600">
                  {lawyer.name?.charAt(0) || 'L'}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{lawyer.name}</h2>
              <p className="text-gray-600">{lawyer.practiceArea}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-yellow-500">⭐ {lawyer.rating}</span>
                <span className="text-gray-600">₹{lawyer.fees}/consultation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Appointment Details</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Consultation Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Consultation Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Video Call Option */}
                <div
                  onClick={() => setConsultationType('video')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    consultationType === 'video'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">📹</div>
                    <div className="font-medium">Video Call</div>
                    <div className="text-xs text-gray-600 mt-1">Face-to-face consultation</div>
                    <div className="text-xs font-medium text-green-600 mt-1">₹{lawyer?.fees || 500}</div>
                  </div>
                </div>

                {/* Audio Call Option */}
                <div
                  onClick={() => setConsultationType('audio')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    consultationType === 'audio'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">📞</div>
                    <div className="font-medium">Audio Call</div>
                    <div className="text-xs text-gray-600 mt-1">Voice-only consultation</div>
                    <div className="text-xs font-medium text-blue-600 mt-1">₹{Math.round((lawyer?.fees || 500) * 0.8)}</div>
                  </div>
                </div>

                {/* Chat Option */}
                <div
                  onClick={() => setConsultationType('chat')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    consultationType === 'chat'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">💬</div>
                    <div className="font-medium">Chat</div>
                    <div className="text-xs text-gray-600 mt-1">Text-based consultation</div>
                    <div className="text-xs font-medium text-purple-600 mt-1">₹{Math.round((lawyer?.fees || 500) * 0.6)}</div>
                  </div>
                </div>
              </div>
              
              {/* Selected consultation type info */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium">Selected: </span>
                  <span className={`${
                    consultationType === 'video' ? 'text-green-600' :
                    consultationType === 'audio' ? 'text-blue-600' :
                    'text-purple-600'
                  }`}>
                    {consultationType === 'video' ? '📹 Video Call' :
                     consultationType === 'audio' ? '📞 Audio Call' :
                     '💬 Chat Consultation'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {consultationType === 'video' && 'High-quality video consultation with screen sharing capabilities'}
                  {consultationType === 'audio' && 'Professional voice consultation for detailed legal discussions'}
                  {consultationType === 'chat' && 'Secure text-based consultation with document sharing'}
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date *
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a date</option>
                {availableDates.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 border rounded-lg text-sm transition-colors ${
                      selectedTime === time
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your legal issue or any specific questions..."
              />
            </div>

            {/* Pricing Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Consultation Fee:</span>
                <span className={`text-lg font-bold ${
                  consultationType === 'video' ? 'text-green-600' :
                  consultationType === 'audio' ? 'text-blue-600' :
                  'text-purple-600'
                }`}>
                  ₹{consultationType === 'video' ? (lawyer?.fees || 500) :
                     consultationType === 'audio' ? Math.round((lawyer?.fees || 500) * 0.8) :
                     Math.round((lawyer?.fees || 500) * 0.6)}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Payment will be processed after lawyer accepts your request
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                consultationType === 'video' ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400' :
                consultationType === 'audio' ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400' :
                'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400'
              } text-white`}
            >
              {isSubmitting ? 'Sending Request...' : `Book ${
                consultationType === 'video' ? 'Video' :
                consultationType === 'audio' ? 'Audio' :
                'Chat'
              } Consultation`}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Your appointment request will be sent to {lawyer.name}</li>
              <li>2. The lawyer will review and accept/decline your request</li>
              <li>3. You'll receive a notification once the lawyer responds</li>
              <li>4. If accepted, you'll get a link to join the consultation</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
