import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ChatConsultation = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [consultation, setConsultation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConsultationDetails();
    fetchChatHistory();
    
    // Simulate real-time connection
    const interval = setInterval(() => {
      // Simulate receiving messages (in real app, this would be WebSocket)
      if (Math.random() > 0.95) {
        simulateIncomingMessage();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [consultationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('lawyerToken');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/consultation/${consultationId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Load demo messages for now
      setMessages([
        {
          id: 1,
          text: "Hello! I'm ready to help with your legal consultation.",
          sender: 'other',
          timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
          type: 'text'
        }
      ]);
    }
  };

  const simulateIncomingMessage = () => {
    const responses = [
      "Could you provide more details about your case?",
      "I understand your concern. Let me explain the legal implications.",
      "Based on what you've shared, here are your options...",
      "Do you have any supporting documents for this matter?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const newMsg = {
      id: Date.now(),
      text: randomResponse,
      sender: 'other',
      timestamp: new Date().toLocaleTimeString(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMsg]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('lawyerToken');
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/consultation/${consultationId}/message`,
        { message: message.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Message still appears locally for demo
    }

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate response after a delay
      setTimeout(simulateIncomingMessage, 1000);
    }, 2000);
  };

  const sendFile = (file) => {
    const message = {
      id: Date.now(),
      text: `📎 ${file.name}`,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString(),
      type: 'file',
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(1) + ' KB'
    };

    setMessages(prev => [...prev, message]);
    toast.success(`File "${file.name}" shared successfully`);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const endConsultation = () => {
    navigate('/user-dashboard');
    toast.info('Chat consultation ended');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {consultation?.lawyerName?.[0] || consultation?.userName?.[0] || 'L'}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {consultation?.lawyerName || consultation?.userName || 'Legal Consultation'}
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-500">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/video-call/${consultationId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📹 Video Call
          </button>
          <button
            onClick={() => navigate(`/audio-call/${consultationId}`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🎧 Audio Call
          </button>
          <button
            onClick={endConsultation}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            End Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'me'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border'
              }`}
            >
              {message.type === 'file' ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">📎</span>
                  <div>
                    <p className="font-medium">{message.fileName}</p>
                    <p className="text-xs opacity-70">{message.fileSize}</p>
                  </div>
                </div>
              ) : (
                <p>{message.text}</p>
              )}
              <p className={`text-xs mt-1 ${
                message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-3 items-end">
          <input
            type="file"
            id="file-upload-chat"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                sendFile(file);
              }
            }}
          />
          <label
            htmlFor="file-upload-chat"
            className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            📎
          </label>
          
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              className="w-full border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="1"
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatConsultation;
