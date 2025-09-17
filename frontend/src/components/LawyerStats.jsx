import React from 'react';

const LawyerStats = ({ consultations }) => {
  const totalConsultations = consultations.length;
  const pendingConsultations = consultations.filter(c => c.status === 'pending').length;
  const acceptedConsultations = consultations.filter(c => c.status === 'accepted').length;
  const completedConsultations = consultations.filter(c => c.status === 'completed').length;

  const stats = [
    {
      title: 'Total Requests',
      value: totalConsultations,
      icon: '📋',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Pending',
      value: pendingConsultations,
      icon: '⏳',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    {
      title: 'Accepted',
      value: acceptedConsultations,
      icon: '✅',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      title: 'Completed',
      value: completedConsultations,
      icon: '🎯',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`p-4 rounded-lg border ${stat.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LawyerStats;
