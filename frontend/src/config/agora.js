// Agora Configuration
// For demo purposes, using a test App ID
// In production, replace with your actual Agora App ID and implement token server

export const AGORA_CONFIG = {
  // Demo App ID - replace with your actual App ID from Agora Console
  APP_ID: "aab8b8f5a8cd4469a63042fcfafe7063", // Demo App ID
  
  // For production, implement a token server
  // For demo/testing, we can use null (less secure)
  TOKEN: null,
  
  // Channel configuration
  CHANNEL_PREFIX: "legalsathi_",
  
  // Video encoding configuration
  VIDEO_CONFIG: {
    width: 640,
    height: 480,
    frameRate: 15,
    bitrateMin: 600,
    bitrateMax: 1000,
  },
  
  // Audio configuration
  AUDIO_CONFIG: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  
  // Client configuration
  CLIENT_CONFIG: {
    mode: "rtc",
    codec: "vp8"
  }
};

// Generate channel name for consultation
export const getChannelName = (consultationId) => {
  return `${AGORA_CONFIG.CHANNEL_PREFIX}${consultationId}`;
};

// Generate UID (can be customized based on user)
export const generateUID = () => {
  return Math.floor(Math.random() * 100000);
};
