import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = async (req, res, next) => {
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
    
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    // Validate token format
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return res.json({ success: false, message: "Malformed JWT token" });
    }
    
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user role
    if (token_decode.role !== 'user') {
      return res.json({
        success: false,
        message: "Access denied. User role required.",
      });
    }
    
    if (!req.body) {
      req.body = {};
    }
    req.body.userId = token_decode.id;  

    next();
  } catch (error) {
    console.log('JWT Error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.json({ success: false, message: "Invalid token signature" });
    } else if (error.name === 'TokenExpiredError') {
      return res.json({ success: false, message: "Token expired" });
    } else {
      return res.json({ success: false, message: "Authentication failed" });
    }
  }
};


export default authUser;
