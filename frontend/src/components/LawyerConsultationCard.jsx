import React from 'react';

const LawyerConsultationCard = ({ consultation, onAccept, onReject, onJoin }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{consultation.userName}</h3>
          <p className="text-sm text-gray-600">{consultation.userEmail}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
          {consultation.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Type:</span>
          <span className="text-sm text-gray-600">{consultation.consultationType}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Date:</span>
          <span className="text-sm text-gray-600">{formatDate(consultation.slotDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Time:</span>
          <span className="text-sm text-gray-600">{formatTime(consultation.preferredTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Requested:</span>
          <span className="text-sm text-gray-600">
            {new Date(consultation.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      {consultation.message && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">Message:</span>
          <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-lg">
            {consultation.message}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {consultation.status === 'pending' && (
          <>
            <button
              onClick={() => onAccept(consultation._id)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Accept
            </button>
            <button
              onClick={() => onReject(consultation._id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Reject
            </button>
          </>
        )}
        
        {consultation.status === 'accepted' && (
          <div className="flex gap-2 w-full">
            <button
              onClick={() => onJoin(consultation, 'video')}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              📹 Video Call
            </button>
            <button
              onClick={() => onJoin(consultation, 'audio')}
              className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              🎧 Audio Call
            </button>
            <button
              onClick={() => onJoin(consultation, 'chat')}
              className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              💬 Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerConsultationCard;
