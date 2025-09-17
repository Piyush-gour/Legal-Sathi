import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import lawyerRouter from "./routes/lawyerRoute.js";
import twilioRouter from "./routes/twilioRoutes.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'http://10.37.40.34:5173',
    'http://10.37.40.34:5174',
    'http://10.37.40.34:5175',
    'http://192.168.137.1:5173',
    'http://192.168.137.1:5174',
    'http://192.168.137.1:5175',
    'http://192.168.70.126:5173',
    'http://192.168.70.126:5174',
    'http://192.168.70.126:5175',
    'http://10.194.25.34:5173',
    'http://10.194.25.34:5174',
    'http://10.194.25.34:5175'
  ],
  credentials: true
}));

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/lawyer", lawyerRouter);
app.use("/api/twilio", twilioRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, '0.0.0.0', () => {
  console.log("Server started", port);
});