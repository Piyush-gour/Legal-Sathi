import express from "express";
import {
  loginAdmin,
  allLawyers,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  pendingLawyers,
  approveLawyer,
  rejectLawyer,
  changeAvailability,
  clearTestData,
  getConsultationRequests,
  getAllUsers,
  toggleUserBlock,
  getDashboardStats
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor); // Disabled - only self-registration allowed
adminRouter.post("/login", loginAdmin);
// adminRouter.post("/all-doctors", authAdmin, addDoctor); // Disabled - only self-registration allowed
adminRouter.get("/lawyers", authAdmin, allLawyers);
adminRouter.get("/approved-lawyers", authAdmin, allLawyers);
adminRouter.get("/pending-lawyers", authAdmin, pendingLawyers);
adminRouter.post("/approve-lawyer", authAdmin, approveLawyer);
adminRouter.post("/reject-lawyer", authAdmin, rejectLawyer);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/consultation-requests", authAdmin, getConsultationRequests);
adminRouter.post("/clear-test-data", authAdmin, clearTestData);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.get("/users", authAdmin, getAllUsers);
adminRouter.put("/users/:userId/block", authAdmin, toggleUserBlock);
adminRouter.get("/stats", authAdmin, getDashboardStats);

export default adminRouter;