import express from "express";
import {
  registerLawyer,
  loginLawyer,
  consultationsLawyer,
  consultationComplete,
  consultationCancel,
  lawyerDashboard,
  lawyerProfile,
  updateLawyerProfile,
  getConsultationRequests,
  acceptConsultationRequest,
  rejectConsultationRequest,
  getLawyerProfile,
  updateLawyerProfileNew,
  toggleLawyerAvailability
} from "../controllers/lawyerController.js";
import authLawyer from "../middlewares/authLawyer.js";
import upload from "../middlewares/multer.js";

const lawyerRouter = express.Router();

lawyerRouter.post("/register", upload.single('profileImage'), registerLawyer);
lawyerRouter.post("/login", loginLawyer);
lawyerRouter.get("/consultations", authLawyer, consultationsLawyer);
lawyerRouter.post("/complete-consultation", authLawyer, consultationComplete);
lawyerRouter.post("/cancel-consultation", authLawyer, consultationCancel);
lawyerRouter.get("/dashboard", authLawyer, lawyerDashboard);
lawyerRouter.get("/profile", authLawyer, getLawyerProfile);
lawyerRouter.put("/profile", authLawyer, updateLawyerProfileNew);
lawyerRouter.post("/toggle-availability", authLawyer, toggleLawyerAvailability);
lawyerRouter.get("/consultation-requests", authLawyer, getConsultationRequests);
lawyerRouter.post("/consultation-request/accept", authLawyer, acceptConsultationRequest);
lawyerRouter.post("/consultation-request/reject", authLawyer, rejectConsultationRequest);

export default lawyerRouter;
