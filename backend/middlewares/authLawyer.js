import jwt from "jsonwebtoken";

// Lawyer authentication middleware
const authLawyer = async (req, res, next) => {
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
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }
    console.log('Token received:', token);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Validate token format
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return res.json({ success: false, message: "Malformed JWT token" });
    }
    
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify lawyer role
    if (token_decode.role !== 'lawyer') {
      return res.json({
        success: false,
        message: "Access denied. Lawyer role required.",
      });
    }
    
    if (!req.body) {
      req.body = {};
    }
    req.body.lawyerId = token_decode.id;
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

export default authLawyer;
