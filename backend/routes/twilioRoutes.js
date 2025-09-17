import express from 'express';
import { generateAccessToken, getRoomInfo, endRoom } from '../controllers/twilioController.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

// Middleware to handle demo mode or authentication
const authOrDemo = async (req, res, next) => {
  try {
    const { authorization, token: headerToken } = req.headers;
    let token = null;
    
    // Handle Bearer token format
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    }
    // Handle direct token in header
    else if (headerToken) {
      token = headerToken;
    }
    
    // If no token or invalid token, allow demo mode
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      req.demoMode = true;
      req.body.userId = 'demo-user';
      return next();
    }
    
    // Try to authenticate normally
    return authUser(req, res, next);
  } catch (error) {
    // If authentication fails, fall back to demo mode
    req.demoMode = true;
    req.body.userId = 'demo-user';
    next();
  }
};

// Generate access token for video call
router.post('/access-token', authOrDemo, generateAccessToken);

// Get or create room information
router.get('/room/:roomName', authUser, getRoomInfo);

// End a video room
router.post('/end-room/:roomName', authUser, endRoom);

export default router;
