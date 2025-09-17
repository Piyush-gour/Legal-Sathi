import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken, aToken, authorization } = req.headers;
        let token = atoken || aToken;
        
        // Handle Bearer token format
        if (!token && authorization && authorization.startsWith('Bearer ')) {
            token = authorization.split(' ')[1];
        }
        
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (token_decode.email !== process.env.ADMIN_EMAIL || token_decode.password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authAdmin