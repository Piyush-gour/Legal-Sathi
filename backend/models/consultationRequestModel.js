import mongoose from "mongoose";

const consultationRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lawyer',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  lawyerName: {
    type: String,
    required: true
  },
  consultationType: {
    type: String,
    enum: ['video', 'phone', 'chat'],
    required: true
  },
  preferredTime: {
    type: String
  },
  slotDate: {
    type: String
  },
  slotTime: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  scheduledAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const consultationRequestModel = mongoose.models.consultationRequest || mongoose.model('consultationRequest', consultationRequestSchema);

export default consultationRequestModel;
