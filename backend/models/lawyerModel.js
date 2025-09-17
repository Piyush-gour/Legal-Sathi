import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: "" },
  speciality: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  available: { type: Boolean, default: true },
  approved: { type: Boolean, default: false }, // Admin approval status
  fees: { type: Number, required: true },
  address: { type: Object, required: true },
  date: { type: Number, required: true },
  slots_booked: { type: Object, default: {} },
  
  // Additional fields for lawyer registration
  phone: { type: String, required: true },
  barCouncilId: { type: String, required: true, unique: true },
  practiceArea: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  languages: { type: String, required: true },
  achievements: { type: String, default: "" },
  availability: {
    days: [{ type: String }],
    timings: { type: String }
  },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { minimize: false });

const lawyerModel = mongoose.models.lawyer || mongoose.model("lawyer", lawyerSchema);

export default lawyerModel;
