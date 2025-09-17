import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import lawyerModel from "../models/lawyerModel.js";
import consultationModel from "../models/appointmentModel.js";
import consultationRequestModel from "../models/consultationRequestModel.js";
import validator from "validator";
import fs from "fs";
import sharp from "sharp";

// API for lawyer registration
const registerLawyer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      qualification,
      specialization,
      experience,
      barCouncilId,
      practiceArea,
      city,
      state,
      languages,
      about,
      achievements,
      consultationFees,
      availabilityDays,
      availabilityTimings,
      officeAddress
    } = req.body;

    // Validation
    if (!fullName || !email || !password || !phone || !qualification || !specialization || !experience || !barCouncilId) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password (min 8 characters)" });
    }

    // Check if lawyer already exists
    const existingLawyer = await lawyerModel.findOne({ email });
    if (existingLawyer) {
      return res.json({ success: false, message: "Lawyer already exists with this email" });
    }

    // Check if Bar Council ID already exists
    const existingBarId = await lawyerModel.findOne({ barCouncilId });
    if (existingBarId) {
      return res.json({ success: false, message: "Bar Council ID already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile image - process to square and store as base64 in MongoDB
    let imageUrl = "";
    if (req.file) {
      try {
        // Read the uploaded image
        const imageBuffer = fs.readFileSync(req.file.path);
        
        // Process image to square format (300x300) using Sharp
        const processedImageBuffer = await sharp(imageBuffer)
          .resize(300, 300, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 85 })
          .toBuffer();
        
        // Convert processed image to base64
        const base64Image = `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}`;
        imageUrl = base64Image;
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.log("Image processing error:", error);
        imageUrl = "";
      }
    }

    // Parse availability days
    let parsedAvailabilityDays = [];
    try {
      parsedAvailabilityDays = JSON.parse(availabilityDays);
    } catch (error) {
      parsedAvailabilityDays = [];
    }

    // Create lawyer data
    const lawyerData = {
      name: fullName,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality: specialization,
      qualification,
      experience,
      about,
      fees: parseInt(consultationFees),
      address: {
        line1: officeAddress,
        line2: city + ", " + state
      },
      date: Date.now(),
      phone,
      barCouncilId,
      practiceArea,
      city,
      state,
      languages,
      achievements: achievements || "",
      availability: {
        days: parsedAvailabilityDays,
        timings: availabilityTimings
      },
      approved: false, // Explicitly set to false for admin approval
      available: true  // Available once approved
    };

    try {
      const newLawyer = new lawyerModel(lawyerData);
      const savedLawyer = await newLawyer.save();
      res.json({ 
        success: true, 
        message: "Registration submitted successfully! Please wait for admin approval.",
        lawyer: savedLawyer
      });
    } catch (saveError) {
      if (saveError.code === 11000) {
        // Handle duplicate key error
        if (saveError.message.includes('email')) {
          res.json({ success: false, message: "Email already registered" });
        } else if (saveError.message.includes('barCouncilId')) {
          res.json({ success: false, message: "Bar Council ID already registered" });
        } else {
          res.json({ success: false, message: "Registration already exists" });
        }
      } else {
        throw saveError;
      }
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for lawyer login
const loginLawyer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lawyer = await lawyerModel.findOne({ email });

    if (!lawyer) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Check if lawyer is approved
    if (!lawyer.approved) {
      return res.json({ success: false, message: "Your registration is pending admin approval" });
    }

    const isMatch = await bcrypt.compare(password, lawyer.password);

    if (isMatch) {
      const token = jwt.sign({ id: lawyer._id, role: 'lawyer' }, process.env.JWT_SECRET);
      res.json({ success: true, token, lawyer: { id: lawyer._id, name: lawyer.name, email: lawyer.email, role: 'lawyer' } });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get lawyer consultations for lawyer panel
const consultationsLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.body;
    const consultations = await consultationModel.find({ lawyerId });
    res.json({ success: true, consultations });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark consultation completed for lawyer panel
const consultationComplete = async (req, res) => {
  try {
    const { lawyerId, consultationId } = req.body;

    const consultationData = await consultationModel.findById(consultationId);
    if (consultationData && consultationData.lawyerId === lawyerId) {
      await consultationModel.findByIdAndUpdate(consultationId, { isCompleted: true });
      return res.json({ success: true, message: 'Consultation Completed' });
    } else {
      return res.json({ success: false, message: 'Mark Failed' });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel consultation for lawyer panel
const consultationCancel = async (req, res) => {
  try {
    const { lawyerId, consultationId } = req.body;

    const consultationData = await consultationModel.findById(consultationId);
    if (consultationData && consultationData.lawyerId === lawyerId) {
      await consultationModel.findByIdAndUpdate(consultationId, { cancelled: true });
      return res.json({ success: true, message: 'Consultation Cancelled' });
    } else {
      return res.json({ success: false, message: 'Cancellation Failed' });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for lawyer panel
const lawyerDashboard = async (req, res) => {
  try {
    const { lawyerId } = req.body;

    const consultations = await consultationModel.find({ lawyerId });

    let earnings = 0;
    consultations.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];
    consultations.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      consultations: consultations.length,
      patients: patients.length,
      latestConsultations: consultations.reverse().slice(0, 5)
    };

    res.json({ success: true, dashData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get lawyer profile for lawyer panel
const lawyerProfile = async (req, res) => {
  try {
    const { lawyerId } = req.body;
    const profileData = await lawyerModel.findById(lawyerId).select('-password');
    res.json({ success: true, profileData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update lawyer profile from lawyer panel
const updateLawyerProfile = async (req, res) => {
  try {
    const { lawyerId, fees, address, available } = req.body;

    await lawyerModel.findByIdAndUpdate(lawyerId, { fees, address, available });

    res.json({ success: true, message: 'Profile Updated' });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get consultation requests for lawyer
const getConsultationRequests = async (req, res) => {
  try {
    const lawyerId = req.body.lawyerId || req.lawyerId;
    
    const requests = await consultationRequestModel
      .find({ lawyerId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to accept consultation request
const acceptConsultationRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    
    await consultationRequestModel.findByIdAndUpdate(requestId, { 
      status: 'accepted',
      scheduledAt: new Date()
    });

    res.json({ success: true, message: "Consultation request accepted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to reject consultation request
const rejectConsultationRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    
    await consultationRequestModel.findByIdAndUpdate(requestId, { 
      status: 'rejected'
    });

    res.json({ success: true, message: "Consultation request rejected" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get lawyer profile
const getLawyerProfile = async (req, res) => {
  try {
    const { lawyerId } = req.body;
    
    const lawyer = await lawyerModel.findById(lawyerId).select('-password');
    
    if (!lawyer) {
      return res.json({ success: false, message: "Lawyer not found" });
    }

    res.json({ success: true, lawyer });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update lawyer profile
const updateLawyerProfileNew = async (req, res) => {
  try {
    const { lawyerId } = req.body;
    const updateData = req.body;
    
    // Remove lawyerId from update data
    delete updateData.lawyerId;
    
    const updatedLawyer = await lawyerModel.findByIdAndUpdate(
      lawyerId, 
      updateData, 
      { new: true }
    ).select('-password');

    res.json({ success: true, lawyer: updatedLawyer, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to toggle lawyer availability
const toggleLawyerAvailability = async (req, res) => {
  try {
    const { lawyerId } = req.body;
    
    const lawyer = await lawyerModel.findById(lawyerId);
    
    if (!lawyer) {
      return res.json({ success: false, message: "Lawyer not found" });
    }

    const updatedLawyer = await lawyerModel.findByIdAndUpdate(
      lawyerId,
      { available: !lawyer.available },
      { new: true }
    ).select('-password');

    res.json({ success: true, lawyer: updatedLawyer, message: "Availability updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
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
  toggleLawyerAvailability,
};
