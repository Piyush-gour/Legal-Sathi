import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const NotificationSystem = () => {
  const [consultations, setConsultations] = useState([]);
  const [incomingCalls, setIncomingCalls] = useState([]);
  const [notifiedCalls, setNotifiedCalls] = useState(new Set());
  const [lastChecked, setLastChecked] = useState(Date.now());
  const navigate = useNavigate();

  const checkForUpdates = async () => {
    try {
      const currentToken = localStorage.getItem("userToken");
      if (!currentToken) return;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/consultations`, {
        headers: { 
          Authorization: `Bearer ${currentToken}`,
          token: currentToken 
        }
      });

      const data = await response.json();
      
      if (data.success) {
        const newConsultations = data.consultations;
        
        // Check for newly accepted consultations and incoming calls
        newConsultations.forEach(consultation => {
          const existing = consultations.find(c => c._id === consultation._id);
          
          // Check for status changes
          if (existing && existing.status !== consultation.status) {
            if (consultation.status === 'accepted') {
              toast.success(`Your consultation request has been accepted by ${consultation.lawyerName || 'the lawyer'}!`, {
                position: "top-right",
                autoClose: 5000,
              });
            } else if (consultation.status === 'rejected') {
              toast.error(`Your consultation request has been rejected by the lawyer.`, {
                position: "top-right",
                autoClose: 5000,
              });
            }
          }
          
          // Check for incoming calls (when lawyer initiates call)
          if (consultation.status === 'accepted' && consultation.callStatus === 'incoming') {
            const callId = consultation._id;
            
            // Check if we've already notified for this call
            if (!notifiedCalls.has(callId)) {
              // Mark as notified to prevent duplicates
              setNotifiedCalls(prev => new Set([...prev, callId]));
              
              // Show incoming call notification
              showIncomingCallNotification(consultation);
            }
          }
          
          // Check for simulated incoming calls (for demo purposes)
          if (consultation.status === 'accepted' && !consultation.callStatus) {
            const callId = consultation._id;
            
            // Only simulate if not already notified
            if (!notifiedCalls.has(callId)) {
              setTimeout(() => {
                if (!notifiedCalls.has(callId)) {
                  setNotifiedCalls(prev => new Set([...prev, callId]));
                  showIncomingCallNotification(consultation);
                }
              }, 10000);
            }
          }
        });
        
        setConsultations(newConsultations);
      }
    } catch (error) {
      console.error('Error checking for consultation updates:', error);
    }
  };

  const showIncomingCallNotification = (consultation) => {
    // Dismiss any existing notifications to prevent duplicates
    toast.dismiss();
    
    const callNotification = toast.success(
      <div className="flex flex-col">
        <div className="font-medium mb-2">
          📞 Incoming {consultation.consultationType} call from {consultation.lawyerName || 'Lawyer'}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleAcceptCall(consultation)}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => handleDeclineCall(consultation)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Decline
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 30000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        className: "bg-blue-50 border-l-4 border-blue-500",
        toastId: `incoming-call-${consultation._id}` // Unique ID to prevent duplicates
      }
    );
    
    // Play notification sound
    playNotificationSound();
    
    // Add to incoming calls list
    setIncomingCalls(prev => [...prev, consultation]);
  };

  const handleAcceptCall = async (consultation) => {
    try {
      // Dismiss all notifications
      toast.dismiss();
      
      // Remove from incoming calls and clear notification tracking
      setIncomingCalls(prev => prev.filter(c => c._id !== consultation._id));
      setNotifiedCalls(prev => {
        const newSet = new Set(prev);
        newSet.delete(consultation._id);
        return newSet;
      });
      
      // Show connecting message
      const connectingToast = toast.info('Connecting to call...', { 
        autoClose: false,
        toastId: 'connecting'
      });
      
      // Update consultation status to indicate call accepted
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/accept-call`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'token': token
            },
            body: JSON.stringify({
              consultationId: consultation._id,
              callStatus: 'connected'
            })
          });
        } catch (error) {
          console.log('Failed to update call status:', error);
        }
      }
      
      // Navigate to appropriate consultation page with call connection flag
      const consultationType = consultation.consultationType;
      const navigationState = { 
        fromIncomingCall: true, 
        consultationId: consultation._id,
        autoConnect: true,
        lawyerInfo: {
          name: consultation.lawyerName,
          _id: consultation.lawyerId
        }
      };
      
      // Dismiss connecting toast before navigation
      toast.dismiss('connecting');
      
      if (consultationType === 'video') {
        navigate(`/video-consultation/${consultation.lawyerId}`, { state: navigationState });
      } else if (consultationType === 'audio') {
        navigate(`/audio-consultation/${consultation.lawyerId}`, { state: navigationState });
      } else if (consultationType === 'chat') {
        navigate(`/chat-consultation/${consultation.lawyerId}`, { state: navigationState });
      } else {
        // Default to video if type is unclear
        navigate(`/video-consultation/${consultation.lawyerId}`, { state: navigationState });
      }
      
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.dismiss();
      toast.error('Failed to connect to call. Please try again.');
    }
  };

  const handleDeclineCall = (consultation) => {
    // Dismiss all notifications
    toast.dismiss();
    
    // Remove from incoming calls and clear notification tracking
    setIncomingCalls(prev => prev.filter(c => c._id !== consultation._id));
    setNotifiedCalls(prev => {
      const newSet = new Set(prev);
      newSet.delete(consultation._id);
      return newSet;
    });
    
    // Show connecting message
    const connectingToast = toast.info('Connecting to call...', { 
      autoClose: false,
      toastId: 'connecting'
    });
    
    // Update consultation status to indicate call accepted
    const token = localStorage.getItem('userToken');
    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/accept-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'token': token
        },
        body: JSON.stringify({
          consultationId: consultation._id,
          callStatus: 'connected'
        })
      }).catch(error => {
        console.log('Failed to update call status:', error);
      });
    }
  };

  const playNotificationSound = () => {
    // Removed call ringing sound - silent notifications only
    console.log('Notification received (silent mode)');
  };

  useEffect(() => {
    // Check for updates every 30 seconds
    const interval = setInterval(checkForUpdates, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default NotificationSystem;
