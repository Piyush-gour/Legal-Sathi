import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import lawyerModel from "../models/lawyerModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email: email, password: password }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all lawyers list for admin panel
const allLawyers = async (req, res) => {
  try {
    const lawyers = await lawyerModel.find({ approved: true }).select("-password");
    res.json({ success: true, approvedLawyers: lawyers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get pending lawyer registrations
const pendingLawyers = async (req, res) => {
  try {
    const pendingLawyers = await lawyerModel.find({ approved: false }).select("-password");
    res.json({ success: true, pendingLawyers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to approve lawyer registration
const approveLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.body;
    
    await lawyerModel.findByIdAndUpdate(lawyerId, { 
      approved: true, 
      available: true 
    });
    
    res.json({ success: true, message: "Lawyer approved successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to reject lawyer registration
const rejectLawyer = async (req, res) => {
  try {
    const { lawyerId, reason } = req.body;
    
    // For now, we'll just delete the registration
    // In a real app, you might want to keep it with a rejected status
    await lawyerModel.findByIdAndDelete(lawyerId);
    
    res.json({ success: true, message: "Lawyer registration rejected" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to change lawyer availability
const changeAvailability = async (req, res) => {
  try {
    const { lawyerId } = req.body;
    const lawyerData = await lawyerModel.findById(lawyerId);
    await lawyerModel.findByIdAndUpdate(lawyerId, { available: !lawyerData.available });
    res.json({ success: true, message: 'Availability Changed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Clear test data (development only)
const clearTestData = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.json({ success: false, message: 'Not allowed in production' });
    }
    
    await lawyerModel.deleteMany({});
    res.json({ success: true, message: 'Test data cleared successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const lawyers = await lawyerModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      lawyers: lawyers.length,
      appointments: appointments.length,
      patients: users.length,
      users: users.length,
      consultations: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all consultation requests
const getConsultationRequests = async (req, res) => {
  try {
    const consultationRequestModel = (await import('../models/consultationRequestModel.js')).default;
    
    const requests = await consultationRequestModel.find({})
      .populate('userId', 'name email')
      .populate('lawyerId', 'name email')
      .sort({ requestDate: -1 });
    
    res.json({ success: true, requests });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, '-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// Toggle user block status
const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.json({ 
      success: true, 
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` 
    });
  } catch (error) {
    console.error('Error toggling user block status:', error);
    res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalLawyers,
      pendingRequests,
      activeLawyers,
      totalConsultations,
      recentUsers,
      recentLawyers
    ] = await Promise.all([
      userModel.countDocuments(),
      lawyerModel.countDocuments({ approved: true }),
      lawyerModel.countDocuments({ approved: false }),
      lawyerModel.countDocuments({ approved: true, available: true }),
      appointmentModel.countDocuments(),
      userModel.find().sort({ createdAt: -1 }).limit(5).select('-password'),
      lawyerModel.find({ approved: true }).sort({ createdAt: -1 }).limit(5).select('-password')
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalLawyers,
        pendingRequests,
        activeLawyers,
        totalConsultations,
        recentUsers,
        recentLawyers
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

export {
  loginAdmin,
  allLawyers,
  appointmentsAdmin,
  appointmentCancel,
  pendingLawyers,
  approveLawyer,
  rejectLawyer,
  changeAvailability,
  clearTestData,
  adminDashboard,
  getConsultationRequests,
  getAllUsers,
  toggleUserBlock,
  getDashboardStats
};