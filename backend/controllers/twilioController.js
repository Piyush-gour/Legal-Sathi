import twilio from 'twilio';

// Twilio credentials (should be in environment variables)
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'demo_account_sid';
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const authToken = process.env.TWILIO_AUTH_TOKEN || 'demo_auth_token';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// Generate access token for Twilio Video
const generateAccessToken = async (req, res) => {
  try {
    const { identity, roomName } = req.body;

    if (!identity || !roomName) {
      return res.status(400).json({
        success: false,
        message: 'Identity and room name are required'
      });
    }

    // Check if we have real Twilio credentials
    const hasRealCredentials = accountSid && 
                               authToken && 
                               accountSid !== 'demo_account_sid' && 
                               authToken !== 'demo_auth_token';

    // If in demo mode (no credentials or invalid auth), return demo response
    if (!hasRealCredentials || req.demoMode) {
      console.log('Demo mode activated - returning demo token');
      return res.json({
        success: true,
        demo: true,
        token: 'demo_token_for_local_testing',
        identity: identity,
        roomName: roomName,
        message: 'Demo mode: Please configure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables for real video calling'
      });
    }

    // Use API Key and Secret if available, otherwise use Account SID and Auth Token
    const keyId = apiKey || accountSid;
    const keySecret = apiSecret || authToken;

    console.log('Creating access token with real credentials:', {
      accountSid: accountSid.substring(0, 8) + '...',
      keyId: keyId ? 'present' : 'missing',
      keySecret: keySecret ? 'present' : 'missing',
      identity: identity,
      roomName: roomName
    });

    // Create an access token
    const token = new AccessToken(
      accountSid,
      keyId,
      keySecret
    );

    // Set the identity of the user
    token.identity = identity;

    // Create a video grant for this token
    const videoGrant = new VideoGrant({
      room: roomName
    });

    // Add the grant to the token
    token.addGrant(videoGrant);

    // Serialize the token to a JWT string
    const jwt = token.toJwt();

    console.log('Generated JWT token successfully for identity:', identity);

    res.json({
      success: true,
      token: jwt,
      identity: identity,
      roomName: roomName
    });

  } catch (error) {
    console.error('Error generating Twilio access token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate access token',
      error: error.message
    });
  }
};

// Create or get room information
const getRoomInfo = async (req, res) => {
  try {
    const { roomName } = req.params;

    if (!accountSid || !authToken) {
      return res.status(500).json({
        success: false,
        message: 'Twilio credentials not configured'
      });
    }

    const client = twilio(accountSid, authToken);

    try {
      // Try to fetch existing room
      const room = await client.video.rooms(roomName).fetch();
      
      res.json({
        success: true,
        room: {
          sid: room.sid,
          uniqueName: room.uniqueName,
          status: room.status,
          dateCreated: room.dateCreated,
          participants: []
        }
      });
    } catch (error) {
      if (error.code === 20404) {
        // Room doesn't exist, create it
        const room = await client.video.rooms.create({
          uniqueName: roomName,
          type: 'group-small', // Supports up to 4 participants
          maxParticipants: 2 // Limit to lawyer and client
        });

        res.json({
          success: true,
          room: {
            sid: room.sid,
            uniqueName: room.uniqueName,
            status: room.status,
            dateCreated: room.dateCreated,
            participants: []
          }
        });
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('Error with Twilio room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get room information',
      error: error.message
    });
  }
};

// End a video room
const endRoom = async (req, res) => {
  try {
    const { roomName } = req.params;

    if (!accountSid || !authToken) {
      return res.status(500).json({
        success: false,
        message: 'Twilio credentials not configured'
      });
    }

    const client = twilio(accountSid, authToken);

    const room = await client.video.rooms(roomName).update({
      status: 'completed'
    });

    res.json({
      success: true,
      message: 'Room ended successfully',
      room: {
        sid: room.sid,
        uniqueName: room.uniqueName,
        status: room.status
      }
    });

  } catch (error) {
    console.error('Error ending Twilio room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end room',
      error: error.message
    });
  }
};

export {
  generateAccessToken,
  getRoomInfo,
  endRoom
};
