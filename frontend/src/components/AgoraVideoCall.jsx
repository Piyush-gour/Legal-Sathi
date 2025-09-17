import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaUser } from 'react-icons/fa';
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';
import { AGORA_CONFIG, getChannelName, generateUID } from '../config/agora';

const AgoraVideoCall = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  
  // Agora client and tracks
  const clientRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const remoteUsersRef = useRef({});
  
  // UI State
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [consultation, setConsultation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isJoining, setIsJoining] = useState(false);
  
  // Call timer
  const callStartTimeRef = useRef(null);
  
  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch consultation details
  const fetchConsultationDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching consultation details for ID:', consultationId);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/consultation/${consultationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Full API response:', response.data);
      
      // Handle different response structures
      const consultationData = response.data.consultation || response.data;
      console.log('Consultation data:', consultationData);
      
      if (!consultationData) {
        throw new Error('No consultation data found in response');
      }
      
      setConsultation(consultationData);
      
      // Determine user role and set current user
      const userId = localStorage.getItem('userId');
      console.log('Current user ID:', userId);
      console.log('Consultation lawyerId:', consultationData.lawyerId);
      console.log('Consultation userId:', consultationData.userId);
      
      // Check if current user is the lawyer
      if (consultationData.lawyerId && consultationData.lawyerId.toString() === userId) {
        setUserRole('lawyer');
        setCurrentUser({
          name: consultationData.lawyerName || consultationData.lawyerFullName || 'Lawyer',
          role: 'lawyer',
          specialty: consultationData.lawyerSpecialty || 'Legal Consultant'
        });
      } 
      // Check if current user is the client
      else if (consultationData.userId && consultationData.userId.toString() === userId) {
        setUserRole('client');
        setCurrentUser({
          name: consultationData.userName || consultationData.clientName || 'Client',
          role: 'client'
        });
      }
      // Fallback - assume client if no match
      else {
        console.log('No role match found, defaulting to client');
        setUserRole('client');
        setCurrentUser({
          name: consultationData.userName || consultationData.clientName || 'User',
          role: 'client'
        });
      }
      
      console.log('Set user role:', userRole);
      console.log('Set current user:', currentUser);
      
    } catch (error) {
      console.error('Error fetching consultation:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load consultation details');
    }
  };

  // Initialize Agora client
  const initializeAgoraClient = async () => {
    try {
      console.log('Initializing Agora Video Call...');
      
      // Create Agora client
      clientRef.current = AgoraRTC.createClient(AGORA_CONFIG.CLIENT_CONFIG);
      
      // Set up event handlers
      clientRef.current.on("user-published", handleUserPublished);
      clientRef.current.on("user-unpublished", handleUserUnpublished);
      clientRef.current.on("user-left", handleUserLeft);
      clientRef.current.on("user-joined", (user) => {
        console.log('User joined channel:', user.uid);
      });
      
      // Create local tracks
      console.log('Creating local video and audio tracks...');
      
      try {
        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.log('getUserMedia not available, trying fallback...');
          
          // Try to create a polyfill
          if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
            navigator.mediaDevices = navigator.mediaDevices || {};
            navigator.mediaDevices.getUserMedia = function(constraints) {
              const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
              return new Promise((resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
              });
            };
          } else {
            throw new Error('getUserMedia not supported in this browser');
          }
        }

        localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: AGORA_CONFIG.VIDEO_CONFIG
        });
        
        localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack(
          AGORA_CONFIG.AUDIO_CONFIG
        );
        
        console.log('✅ Local tracks created successfully');
        
        // Play local video with delay to ensure DOM is ready
        setTimeout(() => {
          if (localVideoTrackRef.current) {
            console.log('Playing local video track...');
            const localVideoElement = document.getElementById('local-video');
            console.log('Local video element found:', !!localVideoElement);
            if (localVideoElement) {
              localVideoTrackRef.current.play('local-video');
              console.log('Local video track played on element: local-video');
            } else {
              console.error('Local video element not found in DOM');
            }
          }
        }, 500);
        
      } catch (trackError) {
        console.error('Failed to create local tracks:', trackError);
        
        // Check if it's a getUserMedia issue
        if (trackError.message.includes('getUserMedia') || trackError.code === 'NOT_SUPPORTED') {
          console.log('getUserMedia not supported, starting audio-only call...');
          
          // Try audio-only fallback
          try {
            localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack(
              AGORA_CONFIG.AUDIO_CONFIG
            );
            console.log('✅ Audio-only track created');
            toast.info('Video not supported - Audio-only call started');
          } catch (audioError) {
            console.error('Audio track creation also failed:', audioError);
            toast.error('Media access not supported in this browser. Starting demo mode.');
            // Continue without media tracks for demo
          }
        } else {
          toast.error('Camera/microphone access denied. Please allow permissions and refresh.');
          return;
        }
      }
      
      // Join channel
      setIsJoining(true);
      const channelName = getChannelName(consultationId);
      const uid = await clientRef.current.join(AGORA_CONFIG.APP_ID, channelName, AGORA_CONFIG.TOKEN, generateUID());
      
      console.log(`✅ Joined channel: ${channelName} with UID: ${uid}`);
      
      // Publish local tracks (handle partial track availability)
      const tracksToPublish = [];
      if (localVideoTrackRef.current) {
        tracksToPublish.push(localVideoTrackRef.current);
        console.log('Adding video track to publish');
      }
      if (localAudioTrackRef.current) {
        tracksToPublish.push(localAudioTrackRef.current);
        console.log('Adding audio track to publish');
      }
      
      if (tracksToPublish.length > 0) {
        await clientRef.current.publish(tracksToPublish);
        console.log(`✅ Published ${tracksToPublish.length} track(s)`);
        console.log('Published tracks:', tracksToPublish);
      } else {
        console.log('No tracks available to publish - joining channel only');
      }
      
      // List all remote users in channel
      const remoteUsers = clientRef.current.remoteUsers;
      console.log('Remote users in channel:', remoteUsers.length);
      remoteUsers.forEach(user => {
        console.log('Remote user:', user.uid, 'hasVideo:', user.hasVideo, 'hasAudio:', user.hasAudio);
        
        // Auto-subscribe to existing remote users
        if (user.hasVideo) {
          console.log('Auto-subscribing to existing video from user:', user.uid);
          clientRef.current.subscribe(user, 'video').then(() => {
            console.log('Auto-subscribed to video from:', user.uid);
            setTimeout(() => {
              if (user.videoTrack) {
                user.videoTrack.play('remote-video');
                console.log('Playing existing remote video');
              }
            }, 500);
          }).catch(err => console.error('Auto-subscribe video failed:', err));
        }
        
        if (user.hasAudio) {
          console.log('Auto-subscribing to existing audio from user:', user.uid);
          clientRef.current.subscribe(user, 'audio').then(() => {
            console.log('Auto-subscribed to audio from:', user.uid);
            if (user.audioTrack) {
              user.audioTrack.play();
            }
          }).catch(err => console.error('Auto-subscribe audio failed:', err));
        }
      });
      
      setIsConnected(true);
      setIsJoining(false);
      callStartTimeRef.current = Date.now();
      toast.success('Video call connected successfully!');
      
    } catch (error) {
      console.error('Agora initialization failed:', error);
      setIsJoining(false);
      toast.error(`Failed to connect: ${error.message}`);
    }
  };

  // Handle remote user published
  const handleUserPublished = async (user, mediaType) => {
    console.log('🔥 Remote user published:', user.uid, mediaType);
    
    try {
      await clientRef.current.subscribe(user, mediaType);
      console.log('✅ Successfully subscribed to user:', user.uid, mediaType);
      
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        console.log('📹 Remote video track received:', remoteVideoTrack);
        
        // Update remote users state immediately
        setRemoteUsers(prev => {
          const updated = [...prev];
          const existingIndex = updated.findIndex(u => u.uid === user.uid);
          if (existingIndex >= 0) {
            updated[existingIndex] = user;
          } else {
            updated.push(user);
          }
          console.log('📊 Updated remote users count:', updated.length);
          return updated;
        });
        
        // Play video with multiple attempts
        const playVideo = () => {
          const remoteVideoElement = document.getElementById('remote-video');
          console.log('🎬 Remote video element found:', !!remoteVideoElement);
          
          if (remoteVideoElement && remoteVideoTrack) {
            console.log('▶️ Playing remote video track for user:', user.uid);
            remoteVideoTrack.play('remote-video');
            console.log('✅ Remote video track played on element: remote-video');
            
            // Force a re-render to hide placeholder
            setRemoteUsers(prev => [...prev]);
          } else {
            console.error('❌ Remote video element or track not available');
          }
        };
        
        // Try immediately and with delays
        playVideo();
        setTimeout(playVideo, 500);
        setTimeout(playVideo, 1000);
      }
      
      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack;
        console.log('🔊 Playing remote audio track for user:', user.uid);
        if (remoteAudioTrack) {
          remoteAudioTrack.play();
        }
        
        // Update remote users state for audio
        setRemoteUsers(prev => {
          const updated = [...prev];
          const existingIndex = updated.findIndex(u => u.uid === user.uid);
          if (existingIndex >= 0) {
            updated[existingIndex] = user;
          } else {
            updated.push(user);
          }
          return updated;
        });
      }
      
    } catch (error) {
      console.error('❌ Error subscribing to remote user:', error);
    }
  };

  // Handle remote user unpublished
  const handleUserUnpublished = (user, mediaType) => {
    console.log('Remote user unpublished:', user.uid, mediaType);
  };

  // Handle remote user left
  const handleUserLeft = (user) => {
    console.log('Remote user left:', user.uid);
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  };

  // Toggle microphone
  const toggleMicrophone = async () => {
    if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setEnabled(!isMuted);
      setIsMuted(!isMuted);
      toast.info(isMuted ? 'Microphone unmuted' : 'Microphone muted');
    }
  };

  // Toggle video
  const toggleVideo = async () => {
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
      toast.info(isVideoOff ? 'Camera turned on' : 'Camera turned off');
    }
  };

  // End call
  const endCall = async () => {
    try {
      // Clean up local tracks
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
        localVideoTrackRef.current.close();
      }
      
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
      }
      
      // Leave channel
      if (clientRef.current) {
        await clientRef.current.leave();
      }
      
      setIsConnected(false);
      
      // Show success popup and redirect based on user role
      toast.success('Video call completed successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Redirect based on user role
      if (userRole === 'lawyer') {
        navigate('/lawyer-dashboard');
      } else {
        navigate('/user-dashboard');
      }
      
    } catch (error) {
      console.error('Error ending call:', error);
      toast.success('Video call completed successfully!', {
        position: "top-center",
        autoClose: 3000,
      });
      
      // Redirect based on user role even if there's an error
      if (userRole === 'lawyer') {
        navigate('/lawyer-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  };

  // Initialize on component mount
  useEffect(() => {
    fetchConsultationDetails();
    
    return () => {
      // Cleanup on unmount
      endCall();
    };
  }, [consultationId]);

  // Auto-start call when consultation data is loaded
  useEffect(() => {
    if (consultation && currentUser && !isConnected && !isJoining) {
      console.log('Starting Agora video call...');
      console.log('Video elements exist:', {
        localVideo: document.getElementById('local-video'),
        remoteVideo: document.getElementById('remote-video')
      });
      setTimeout(() => {
        initializeAgoraClient();
      }, 1000);
    }
  }, [consultation, currentUser]);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (isConnected && callStartTimeRef.current) {
      interval = setInterval(() => {
        const now = Date.now();
        const duration = Math.floor((now - callStartTimeRef.current) / 1000);
        setCallDuration(duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading consultation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Video Consultation</h1>
            <p className="text-gray-400 text-sm">
              {userRole === 'lawyer' ? `Client: ${consultation.clientName}` : `Lawyer: ${consultation.lawyerFullName}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <span className="text-sm text-gray-400">Duration: </span>
              <span className="font-mono">{formatDuration(callDuration)}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isConnected ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
            }`}>
              {isJoining ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Remote Participant */}
          <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div 
              id="remote-video" 
              className="w-full h-full"
              style={{ minHeight: '300px' }}
            ></div>
            
            {/* Placeholder when no remote user */}
            {remoteUsers.length === 0 && !isConnected && (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUser className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    {userRole === 'lawyer' ? consultation?.clientName : consultation?.lawyerFullName || 'Waiting for participant...'}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Not connected</p>
                </div>
              </div>
            )}
            
            {/* Connected but no remote video */}
            {isConnected && remoteUsers.length === 0 && (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUser className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    Waiting for {userRole === 'lawyer' ? consultation?.clientName : consultation?.lawyerFullName}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Connected - Waiting for other participant</p>
                </div>
              </div>
            )}
            
            {/* Participant Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${remoteUsers.length > 0 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium">
                  {userRole === 'lawyer' ? consultation?.clientName : consultation?.lawyerFullName || 'Participant'}
                </span>
              </div>
            </div>
          </div>

          {/* Local Participant */}
          <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div 
              id="local-video" 
              className="w-full h-full"
              style={{ minHeight: '300px' }}
            ></div>
            
            {/* Video off overlay */}
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUser className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-300 text-sm">{currentUser?.name || 'You'}</p>
                  <p className="text-gray-400 text-xs mt-1">Camera off</p>
                </div>
              </div>
            )}
            
            {/* Self Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">{currentUser?.name || 'You'}</span>
              </div>
            </div>
            
            {/* Mute indicator for self */}
            {isMuted && (
              <div className="absolute top-4 right-4">
                <div className="bg-red-500 p-2 rounded-full">
                  <FaMicrophoneSlash className="text-white text-xs" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Microphone Toggle */}
          <button
            onClick={toggleMicrophone}
            className={`p-4 rounded-full transition-colors ${
              isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <FaMicrophoneSlash className="text-white text-xl" />
            ) : (
              <FaMicrophone className="text-white text-xl" />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-colors ${
              isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? (
              <FaVideoSlash className="text-white text-xl" />
            ) : (
              <FaVideo className="text-white text-xl" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            title="End call"
          >
            <FaPhoneSlash className="text-white text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgoraVideoCall;
