import twilio from 'twilio';

// Twilio credentials (should be in environment variables)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;

// For demo purposes when credentials are not set
const DEMO_ACCOUNT_SID = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const DEMO_AUTH_TOKEN = 'your_auth_token_here';

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

    // Check if we have valid Twilio credentials
    const validAccountSid = accountSid || DEMO_ACCOUNT_SID;
    const validAuthToken = authToken || DEMO_AUTH_TOKEN;

    // If using demo credentials, return a mock token for testing
    if (!accountSid || !authToken) {
      console.log('Using demo mode - Twilio credentials not configured');
      return res.json({
        success: true,
        token: 'demo_jwt_token_for_testing',
        identity: identity,
        roomName: roomName,
        demo: true,
        message: 'Demo mode - Please configure Twilio credentials for production'
      });
    }

    // Determine which credentials to use for JWT
    let jwtAccountSid = validAccountSid;
    let jwtKeyId = validAccountSid;
    let jwtKeySecret = validAuthToken;

    // If API Key and Secret are provided, use them instead
    if (apiKey && apiSecret) {
      jwtKeyId = apiKey;
      jwtKeySecret = apiSecret;
    }

    console.log('Creating Twilio access token:', {
      accountSid: jwtAccountSid,
      keyId: jwtKeyId ? 'present' : 'missing',
      keySecret: jwtKeySecret ? 'present' : 'missing',
      identity: identity,
      roomName: roomName
    });

    // Create an access token
    const token = new AccessToken(
      jwtAccountSid,
      jwtKeyId,
      jwtKeySecret
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

    const validAccountSid = accountSid || DEMO_ACCOUNT_SID;
    const validAuthToken = authToken || DEMO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      // Demo mode
      return res.json({
        success: true,
        room: {
          sid: `RM${Date.now()}`,
          uniqueName: roomName,
          status: 'in-progress',
          dateCreated: new Date().toISOString(),
          participants: []
        },
        demo: true,
        message: 'Demo mode - Please configure Twilio credentials for production'
      });
    }

    const client = twilio(validAccountSid, validAuthToken);

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
          type: 'group-small',
          maxParticipants: 2
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

    const validAccountSid = accountSid || DEMO_ACCOUNT_SID;
    const validAuthToken = authToken || DEMO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      // Demo mode
      return res.json({
        success: true,
        message: 'Room ended successfully (demo mode)',
        room: {
          sid: `RM${Date.now()}`,
          uniqueName: roomName,
          status: 'completed'
        },
        demo: true
      });
    }

    const client = twilio(validAccountSid, validAuthToken);

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
