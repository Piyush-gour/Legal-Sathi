import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "../backend/config/mongodb.js";
import connectCloudinary from "../backend/config/cloudinary.js";
import adminRouter from "../backend/routes/adminRoute.js";
import doctorRouter from "../backend/routes/doctorRoute.js";
import userRouter from "../backend/routes/userRoute.js";
import lawyerRouter from "../backend/routes/lawyerRoute.js";
import twilioRouter from "../backend/routes/twilioRoutes.js";

// Initialize database connections
connectDB();
connectCloudinary();

// Create Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'https://legal-sathi-bcnp.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));

// API endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/lawyer", lawyerRouter);
app.use("/api/twilio", twilioRouter);

app.get("/api", (req, res) => {
  res.json({ message: "Legal Sathi API is working!" });
});

app.get("/", (req, res) => {
  res.json({ message: "Legal Sathi API is working!" });
});

// Export for Vercel
export default app;
