import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  getAllLawyers,
  requestConsultation,
  getUserConsultations,
  createPaymentOrder,
  verifyPayment,
  getConsultationDetails,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.get("/lawyers", getAllLawyers);
userRouter.post("/request-consultation", authUser, requestConsultation);
userRouter.get("/consultations", authUser, getUserConsultations);
userRouter.get("/consultation-requests", authUser, getUserConsultations);
userRouter.post("/create-payment-order", authUser, createPaymentOrder);
userRouter.post("/verify-payment", authUser, verifyPayment);
userRouter.get("/consultation/:consultationId", authUser, getConsultationDetails);

export default userRouter;