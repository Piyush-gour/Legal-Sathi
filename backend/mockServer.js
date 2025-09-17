import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

// Mock database
let users = [];
let consultations = [];
let lawyers = [];
let admins = [
  {
    id: "admin1",
    email: "admin@legalsathi.com",
    password: "admin123"
  }
];

// Pending lawyer registrations
let pendingLawyers = [];

const app = express();
const port = 4000;
const JWT_SECRET = "mock_jwt_secret_key";

// Middlewares
app.use(express.json());
app.use(cors());

// Mock authentication middleware
const authUser = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid Token" });
  }
};

// Admin authentication middleware
const authAdmin = (req, res, next) => {
  const aToken = req.headers.atoken;
  if (!aToken) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const decoded = jwt.verify(aToken, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid Token" });
  }
};

// User Registration
app.post("/api/user/register", (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.json({ success: false, message: "User already exists" });
  }
  
  // Create new user
  const userId = Date.now().toString();
  const newUser = {
    id: userId,
    name,
    email,
    password, // In real app, this should be hashed
    phone: "",
    address: { line1: "", line2: "" },
    gender: "",
    dob: "",
    image: ""
  };
  
  users.push(newUser);
  
  // Generate token
  const token = jwt.sign({ id: userId }, JWT_SECRET);
  
  res.json({
    success: true,
    message: "Account created successfully",
    token
  });
});

// User Login
app.post("/api/user/login", (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.json({ success: false, message: "Invalid credentials" });
  }
  
  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  
  res.json({
    success: true,
    message: "Login successful",
    token
  });
});

// Get User Profile
app.get("/api/user/get-profile", authUser, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

// Update User Profile
app.post("/api/user/update-profile", authUser, (req, res) => {
  const { name, phone, address, dob, gender } = req.body;
  
  const userIndex = users.findIndex(u => u.id === req.userId);
  if (userIndex === -1) {
    return res.json({ success: false, message: "User not found" });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    phone: phone || users[userIndex].phone,
    address: address || users[userIndex].address,
    dob: dob || users[userIndex].dob,
    gender: gender || users[userIndex].gender
  };
  
  res.json({
    success: true,
    message: "Profile updated successfully"
  });
});

// Book Consultation
app.post("/api/user/book-consultation", authUser, (req, res) => {
  const { lawyerId, slotDate, slotTime, consultationType } = req.body;
  
  const consultationId = Date.now().toString();
  const consultation = {
    id: consultationId,
    userId: req.userId,
    lawyerId,
    slotDate,
    slotTime,
    consultationType: consultationType || "video",
    amount: consultationType === "chat" ? 50 : consultationType === "phone" ? 75 : 100,
    date: new Date().toISOString(),
    cancelled: false,
    payment: true,
    isCompleted: false
  };
  
  consultations.push(consultation);
  
  res.json({
    success: true,
    message: "Consultation booked successfully"
  });
});

// Get User Consultations
app.get("/api/user/consultations", authUser, (req, res) => {
  const userConsultations = consultations.filter(c => c.userId === req.userId);
  
  res.json({
    success: true,
    consultations: userConsultations
  });
});

// Cancel Consultation
app.post("/api/user/cancel-consultation", authUser, (req, res) => {
  const { consultationId } = req.body;
  
  const consultationIndex = consultations.findIndex(
    c => c.id === consultationId && c.userId === req.userId
  );
  
  if (consultationIndex === -1) {
    return res.json({ success: false, message: "Consultation not found" });
  }
  
  consultations[consultationIndex].cancelled = true;
  
  res.json({
    success: true,
    message: "Consultation cancelled successfully"
  });
});

// Get Lawyers List (mock endpoint)
app.get("/api/lawyer/list", (req, res) => {
  res.json({
    success: true,
    lawyers: [] // Will use frontend assets data
  });
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  
  const admin = admins.find(a => a.email === email && a.password === password);
  if (!admin) {
    return res.json({ success: false, message: "Invalid credentials" });
  }
  
  const token = jwt.sign({ id: admin.id }, JWT_SECRET);
  
  res.json({
    success: true,
    message: "Login successful",
    token
  });
});

// Admin Dashboard Data
app.get("/api/admin/dashboard", authAdmin, (req, res) => {
  const dashData = {
    lawyers: lawyers.length,
    consultations: consultations.length,
    users: users.length,
    latestConsultations: consultations.slice(-5).map(c => ({
      ...c,
      lawyerData: lawyers.find(l => l._id === c.lawyerId) || { name: "Unknown", image: "" },
      userData: users.find(u => u.id === c.userId) || { name: "Unknown" }
    })) || []
  };
  
  res.json({
    success: true,
    dashData
  });
});

// Get All Consultations for Admin
app.get("/api/admin/consultations", authAdmin, (req, res) => {
  const consultationsWithData = consultations.map(c => ({
    ...c,
    lawyerData: lawyers.find(l => l._id === c.lawyerId) || { name: "Unknown", image: "" },
    userData: users.find(u => u.id === c.userId) || { name: "Unknown" }
  }));
  
  res.json({
    success: true,
    consultations: consultationsWithData
  });
});

// Get All Users for Admin
app.get("/api/admin/users", authAdmin, (req, res) => {
  res.json({
    success: true,
    users: users
  });
});

// Get All Lawyers for Admin
app.get("/api/admin/lawyers", authAdmin, (req, res) => {
  res.json({
    success: true,
    lawyers: lawyers
  });
});

// Add Lawyer (Admin)
app.post("/api/admin/add-lawyer", authAdmin, (req, res) => {
  const { name, email, password, experience, fees, about, practiceArea, degree, address } = req.body;
  
  const lawyerId = Date.now().toString();
  const newLawyer = {
    _id: lawyerId,
    name,
    email,
    password,
    experience,
    fees: Number(fees),
    about,
    practiceArea,
    degree,
    address: JSON.parse(address),
    available: true,
    image: "/default-lawyer.png",
    date: Date.now()
  };
  
  lawyers.push(newLawyer);
  
  res.json({
    success: true,
    message: "Lawyer added successfully"
  });
});

// Lawyer Registration
app.post("/api/lawyer/register", (req, res) => {
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

    // Check if lawyer already exists
    const existingLawyer = pendingLawyers.find(l => l.email === email) || 
                          lawyers.find(l => l.email === email);
    
    if (existingLawyer) {
      return res.json({ success: false, message: "Lawyer already registered with this email" });
    }

    // Create new lawyer registration
    const newLawyerRegistration = {
      id: Date.now().toString(),
      fullName,
      email,
      password,
      phone,
      qualification,
      specialization,
      experience: parseInt(experience),
      barCouncilId,
      practiceArea,
      city,
      state,
      languages,
      about,
      achievements: achievements || "",
      consultationFees: parseInt(consultationFees),
      availability: {
        days: JSON.parse(availabilityDays),
        timings: availabilityTimings
      },
      officeAddress,
      image: "https://via.placeholder.com/150", // Mock image URL
      status: "pending", // pending, approved, rejected
      registrationDate: new Date().toISOString(),
      available: false // Will be set to true when approved
    };

    pendingLawyers.push(newLawyerRegistration);

    res.json({
      success: true,
      message: "Registration submitted successfully! Please wait for admin approval."
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Registration failed" });
  }
});

// Get Pending Lawyer Registrations (Admin)
app.get("/api/admin/pending-lawyers", authAdmin, (req, res) => {
  res.json({
    success: true,
    pendingLawyers: pendingLawyers
  });
});

// Approve Lawyer Registration (Admin)
app.post("/api/admin/approve-lawyer", authAdmin, (req, res) => {
  try {
    const { lawyerId } = req.body;
    
    const lawyerIndex = pendingLawyers.findIndex(l => l.id === lawyerId);
    if (lawyerIndex === -1) {
      return res.json({ success: false, message: "Lawyer registration not found" });
    }

    const approvedLawyer = pendingLawyers[lawyerIndex];
    
    // Move to approved lawyers list
    const newLawyer = {
      _id: Date.now().toString(),
      name: approvedLawyer.fullName,
      email: approvedLawyer.email,
      password: approvedLawyer.password,
      phone: approvedLawyer.phone,
      degree: approvedLawyer.qualification,
      practiceArea: approvedLawyer.specialization,
      experience: `${approvedLawyer.experience} Years`,
      about: approvedLawyer.about,
      fees: approvedLawyer.consultationFees,
      address: {
        line1: approvedLawyer.officeAddress,
        line2: `${approvedLawyer.city}, ${approvedLawyer.state}`
      },
      available: true,
      image: approvedLawyer.image,
      barCouncilId: approvedLawyer.barCouncilId,
      practiceAreaCourt: approvedLawyer.practiceArea,
      languages: approvedLawyer.languages,
      achievements: approvedLawyer.achievements,
      availability: approvedLawyer.availability,
      approvedDate: new Date().toISOString()
    };

    lawyers.push(newLawyer);
    pendingLawyers.splice(lawyerIndex, 1);

    res.json({
      success: true,
      message: "Lawyer approved successfully"
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to approve lawyer" });
  }
});

// Reject Lawyer Registration (Admin)
app.post("/api/admin/reject-lawyer", authAdmin, (req, res) => {
  try {
    const { lawyerId, reason } = req.body;
    
    const lawyerIndex = pendingLawyers.findIndex(l => l.id === lawyerId);
    if (lawyerIndex === -1) {
      return res.json({ success: false, message: "Lawyer registration not found" });
    }

    // Update status to rejected
    pendingLawyers[lawyerIndex].status = "rejected";
    pendingLawyers[lawyerIndex].rejectionReason = reason;
    pendingLawyers[lawyerIndex].rejectionDate = new Date().toISOString();

    res.json({
      success: true,
      message: "Lawyer registration rejected"
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to reject lawyer" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Mock API Server is working!");
});

app.listen(port, () => {
  console.log(`Mock server running on http://localhost:${port}`);
  console.log("Users:", users.length);
  console.log("Consultations:", consultations.length);
  console.log("Lawyers:", lawyers.length);
});
