import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const AudioCall = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [consultation, setConsultation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callStartTimeRef = useRef(null);

  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    fetchConsultationDetails();
    initializeCall();
    
    return () => {
      cleanup();
    };
  }, [consultationId]);

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

  const fetchConsultationDetails = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('lawyerToken');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/consultation/${consultationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setConsultation(response.data.consultation);
      }
    } catch (error) {
      console.error('Error fetching consultation:', error);
      toast.error('Failed to load consultation details');
    }
  };

  const initializeCall = async () => {
    try {
      // Get audio only
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      });
      
      localStreamRef.current = stream;

      // Initialize peer connection
      const peerConnection = new RTCPeerConnection(rtcConfig);
      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;
        if (state === 'connected') {
          setIsConnected(true);
          callStartTimeRef.current = Date.now();
          toast.success('Audio call connected');
        } else if (state === 'disconnected' || state === 'failed') {
          setIsConnected(false);
          toast.info('Call disconnected');
        }
      };

      // Simulate connection for demo
      setTimeout(() => {
        setIsConnected(true);
        callStartTimeRef.current = Date.now();
        toast.success('Audio call connected');
      }, 2000);

    } catch (error) {
      console.error('Error initializing audio call:', error);
      toast.error('Failed to initialize audio call');
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const endCall = () => {
    cleanup();
    navigate('/user-dashboard');
    toast.info('Call ended');
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Audio Call Interface */}
      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-4xl">🎧</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            {consultation ? `Audio Call with ${consultation.lawyerName || consultation.userName}` : 'Audio Call'}
          </h2>
          <p className="text-gray-300">
            {isConnected ? `Connected - ${formatDuration(callDuration)}` : 'Connecting...'}
          </p>
        </div>

        {/* Audio Controls */}
        <div className="flex gap-6 mb-8">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-600'} hover:opacity-80 transition-opacity`}
          >
            <span className="text-2xl">{isMuted ? '🔇' : '🎤'}</span>
          </button>
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <span className="text-2xl">📞</span>
          </button>
        </div>

        {/* Audio Visualizer Placeholder */}
        <div className="flex gap-1 mb-8">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-blue-500 rounded-full transition-all duration-300 ${
                isConnected ? 'animate-pulse' : ''
              }`}
              style={{
                height: `${Math.random() * 40 + 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="w-80 bg-white flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Chat</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chatMessages.map(message => (
            <div
              key={message.id}
              className={`p-2 rounded-lg max-w-xs ${
                message.sender === 'me'
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
          
          <div className="mt-2">
            <input
              type="file"
              id="file-upload-audio"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  toast.info(`File "${file.name}" ready to share`);
                }
              }}
            />
            <label
              htmlFor="file-upload-audio"
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              📎 Share Document
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCall;
