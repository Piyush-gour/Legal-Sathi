import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import lawyerModel from "../models/lawyerModel.js";
import appointmentModel from "../models/appointmentModel.js";
import consultationRequestModel from "../models/consultationRequestModel.js";
import Razorpay from "razorpay";

// API to get consultation details by ID
const getConsultationDetails = async (req, res) => {
  try {
    const { consultationId } = req.params;
    
    const consultation = await consultationRequestModel
      .findById(consultationId)
      .populate('userId', 'name email')
      .populate('lawyerId', 'firstName lastName specialty');
    
    if (!consultation) {
      return res.json({ success: false, message: "Consultation not found" });
    }
    
    res.json({ 
      success: true, 
      consultation: {
        ...consultation.toObject(),
        clientName: consultation.userId.name,
        lawyerFullName: `${consultation.lawyerId.firstName} ${consultation.lawyerId.lastName}`,
        lawyerSpecialty: consultation.lawyerId.specialty
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);

    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: 'user' } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);
      res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: 'user' } });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const useData = await userModel.findById(userId).select("-password");

    res.json({ success: true, user: useData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    // checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

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

// API to get all approved lawyers for frontend
const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await lawyerModel.find({ 
      approved: true,
      available: { $ne: false } // Include lawyers where available is not explicitly false
    }).select('-password');
    
    // Transform the data to match frontend expectations
    const transformedLawyers = lawyers.map(lawyer => ({
      _id: lawyer._id,
      name: lawyer.name,
      email: lawyer.email,
      image: lawyer.image || '/default-avatar.png',
      practiceArea: lawyer.practiceArea || lawyer.speciality, // Use practiceArea or fallback to speciality
      speciality: lawyer.speciality,
      degree: lawyer.qualification,
      qualification: lawyer.qualification,
      experience: lawyer.experience,
      about: lawyer.about,
      fees: lawyer.fees,
      available: lawyer.available,
      approved: lawyer.approved,
      address: lawyer.address,
      phone: lawyer.phone,
      city: lawyer.city,
      state: lawyer.state,
      languages: lawyer.languages,
      rating: lawyer.rating || 4.5, // Default rating
      reviews: lawyer.reviewCount || Math.floor(Math.random() * 200) + 50, // Default review count
      barCouncilId: lawyer.barCouncilId
    }));
    
    console.log(`Found ${transformedLawyers.length} approved and available lawyers`);
    res.json({ success: true, lawyers: transformedLawyers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get single lawyer profile
const getLawyerProfile = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const lawyer = await lawyerModel.findOne({ 
      _id: lawyerId,
      approved: true,
      available: { $ne: false }
    }).select('-password');
    
    if (!lawyer) {
      return res.json({ success: false, message: "Lawyer not found or not available" });
    }
    
    // Transform the data to match frontend expectations
    const transformedLawyer = {
      _id: lawyer._id,
      name: lawyer.name,
      email: lawyer.email,
      image: lawyer.image || '/default-avatar.png',
      practiceArea: lawyer.practiceArea || lawyer.speciality,
      speciality: lawyer.speciality,
      degree: lawyer.qualification,
      qualification: lawyer.qualification,
      experience: lawyer.experience,
      about: lawyer.about,
      fees: lawyer.fees,
      available: lawyer.available,
      approved: lawyer.approved,
      address: lawyer.address,
      phone: lawyer.phone,
      city: lawyer.city,
      state: lawyer.state,
      languages: lawyer.languages,
      rating: lawyer.rating || 4.5,
      reviews: lawyer.reviewCount || Math.floor(Math.random() * 200) + 50,
      barCouncilId: lawyer.barCouncilId
    };
    
    res.json({ success: true, lawyer: transformedLawyer });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to request consultation with a lawyer
const requestConsultation = async (req, res) => {
  try {
    const userId = req.body.userId || req.userId; // Get from middleware or body
    const { lawyerId, consultationType, message } = req.body;

    // Get user and lawyer data
    const user = await userModel.findById(userId).select('-password');
    const lawyer = await lawyerModel.findById(lawyerId).select('-password');

    if (!user || !lawyer) {
      return res.json({ success: false, message: "User or Lawyer not found" });
    }

    if (!lawyer.approved) {
      return res.json({ success: false, message: "Lawyer is not approved" });
    }

    // Create consultation request
    const consultationRequest = new consultationRequestModel({
      userId,
      lawyerId,
      userName: user.name,
      userEmail: user.email,
      lawyerName: lawyer.name,
      consultationType,
      message,
      preferredTime: req.body.preferredTime,
      slotDate: req.body.slotDate,
      slotTime: req.body.slotTime,
      status: 'pending'
    });

    await consultationRequest.save();

    res.json({ success: true, message: "Consultation request sent successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user's consultation requests
const getUserConsultations = async (req, res) => {
  try {
    const userId = req.body.userId || req.userId;
    
    const consultations = await consultationRequestModel
      .find({ userId })
      .populate('lawyerId', 'name email specialization')
      .sort({ createdAt: -1 });

    res.json({ success: true, consultations });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Initialize Razorpay
const razorpayInstance = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// API to create Razorpay payment order
const createPaymentOrder = async (req, res) => {
  try {
    if (!razorpayInstance) {
      return res.json({ success: false, message: "Payment service not configured" });
    }

    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in smallest currency unit
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify Razorpay payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, consultationId } = req.body;
    
    if (!razorpayInstance) {
      return res.json({ success: false, message: "Payment service not configured" });
    }

    const crypto = await import('crypto');
    const expectedSignature = crypto.default
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      if (consultationId) {
        await consultationRequestModel.findByIdAndUpdate(consultationId, {
          status: 'paid',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id
        });
      }
      
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  getAllLawyers,
  getLawyerProfile,
  requestConsultation,
  getUserConsultations,
  createPaymentOrder,
  verifyPayment,
  getConsultationDetails,
};
