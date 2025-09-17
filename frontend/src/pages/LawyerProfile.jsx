import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const LawyerProfile = () => {
  const { lawyerId } = useParams();
  const navigate = useNavigate();
  const { user, getUserRole, backendUrl } = useAuth();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [relatedLawyers, setRelatedLawyers] = useState([]);

  const userRole = getUserRole();

  // Generate next 7 days for booking
  const generateBookingDates = () => {
    const dates = [];
    const today = new Date();
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        day: days[date.getDay()],
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0]
      });
    }
    return dates;
  };

  const bookingDates = generateBookingDates();

  // Available time slots
  const timeSlots = [
    '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am',
    '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm'
  ];

  useEffect(() => {
    fetchLawyerProfile();
    fetchRelatedLawyers();
  }, [lawyerId]);

  const fetchLawyerProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/lawyer/${lawyerId}`);
      if (response.data.success) {
        setLawyer(response.data.lawyer);
      } else {
        toast.error('Lawyer not found');
        navigate('/lawyers');
      }
    } catch (error) {
      console.error('Error fetching lawyer profile:', error);
      toast.error('Failed to load lawyer profile');
      navigate('/lawyers');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedLawyers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/lawyers`);
      if (response.data.success) {
        // Filter out current lawyer and limit to 4 related lawyers
        const filtered = response.data.lawyers
          .filter(l => l._id !== lawyerId)
          .slice(0, 4);
        setRelatedLawyers(filtered);
      }
    } catch (error) {
      console.error('Error fetching related lawyers:', error);
    }
  };

  const handleBookAppointment = async () => {
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId: lawyerId,
          slotDate: selectedDate,
          slotTime: selectedTime
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/my-appointments');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lawyer profile...</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lawyer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Lawyer Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Lawyer Image */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden flex items-center justify-center">
              {lawyer.image && lawyer.image !== '/default-lawyer.png' ? (
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-600" style={{ display: lawyer.image && lawyer.image !== '/default-lawyer.png' ? 'none' : 'flex' }}>
                {lawyer.name?.charAt(0).toUpperCase() || 'L'}
              </div>
            </div>
          </div>

          {/* Lawyer Details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{lawyer.name}</h1>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">✓</span>
            </div>
            
            <p className="text-blue-600 font-medium mb-2">{lawyer.practiceArea}</p>
            <p className="text-gray-600 mb-4">{lawyer.qualification} • {lawyer.experience}</p>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed">
                {lawyer.about || `${lawyer.name} is a highly experienced lawyer specializing in ${lawyer.practiceArea}. With ${lawyer.experience} of practice, they provide comprehensive legal services with a focus on client satisfaction and successful outcomes.`}
              </p>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div>
                <span className="text-2xl font-bold text-gray-900">₹{lawyer.fees}</span>
                <span className="text-gray-600 ml-1">Consultation fee</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="font-medium">{lawyer.rating || '4.8'}</span>
                <span className="text-gray-500">({lawyer.reviews || '150'} reviews)</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>Location:</strong> {lawyer.city}, {lawyer.state}
              </div>
              <div>
                <strong>Languages:</strong> {lawyer.languages || 'English, Hindi'}
              </div>
              <div>
                <strong>Bar Council ID:</strong> {lawyer.barCouncilId}
              </div>
              <div>
                <strong>Experience:</strong> {lawyer.experience}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      {userRole !== 'lawyer' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking slots</h2>
          
          {/* Date Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-7 gap-2">
              {bookingDates.map((dateObj, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(dateObj.fullDate)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedDate === dateObj.fullDate
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="text-xs font-medium">{dateObj.day}</div>
                  <div className="text-lg font-bold">{dateObj.date}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((time, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Book Appointment Button */}
          <button
            onClick={handleBookAppointment}
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
              selectedDate && selectedTime
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Book an appointment
          </button>
        </div>
      )}

      {/* Related Lawyers */}
      {relatedLawyers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Lawyers</h2>
          <p className="text-gray-600 mb-6">Simply browse through our extensive list of trusted lawyers.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedLawyers.map((relatedLawyer) => (
              <div
                key={relatedLawyer._id}
                onClick={() => navigate(`/lawyer/${relatedLawyer._id}`)}
                className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center">
                  {relatedLawyer.image && relatedLawyer.image !== '/default-lawyer.png' ? (
                    <img
                      src={relatedLawyer.image}
                      alt={relatedLawyer.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-blue-600" style={{ display: relatedLawyer.image && relatedLawyer.image !== '/default-lawyer.png' ? 'none' : 'flex' }}>
                    {relatedLawyer.name?.charAt(0).toUpperCase() || 'L'}
                  </div>
                </div>
                <h3 className="font-semibold text-center text-gray-900 mb-1">
                  {relatedLawyer.name}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-2">
                  {relatedLawyer.practiceArea}
                </p>
                <p className="text-sm text-center text-blue-600 font-medium">
                  ₹{relatedLawyer.fees}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerProfile;
