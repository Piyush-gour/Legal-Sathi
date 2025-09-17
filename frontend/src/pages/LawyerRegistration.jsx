import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const LawyerRegistration = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    qualification: "",
    specialization: "",
    experience: "",
    barCouncilId: "",
    practiceArea: "",
    city: "",
    state: "",
    languages: "",
    about: "",
    achievements: "",
    consultationFees: "",
    availability: {
      days: [],
      timings: ""
    },
    officeAddress: ""
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropSrc, setCropSrc] = useState("");
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const specializations = [
    "Civil Law",
    "Criminal Law", 
    "Corporate Law",
    "Family Law",
    "Property Law",
    "Taxation Law",
    "Labour Law",
    "Constitutional Law",
    "Environmental Law",
    "Intellectual Property Law",
    "Banking Law",
    "Insurance Law"
  ];

  const practiceAreas = [
    "Supreme Court",
    "High Court",
    "District Court",
    "Sessions Court",
    "Magistrate Court",
    "Tribunal",
    "Arbitration",
    "Private Practice"
  ];

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day]
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;
    
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.9);
    });
  };

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
      const croppedImageFile = new File([croppedImageBlob], 'cropped-image.jpg', { type: 'image/jpeg' });
      
      setProfileImage(croppedImageFile);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(croppedImageFile);
      
      setShowCropModal(false);
      setCropSrc("");
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropSrc("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.availability.days.length === 0) {
      toast.error("Please select at least one available day");
      return;
    }

    if (!profileImage) {
      toast.error("Please upload a profile photo");
      return;
    }

    try {
      const submitData = new FormData();
      
      // Append all form data with correct field names
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('phone', formData.phone);
      submitData.append('qualification', formData.qualification);
      submitData.append('specialization', formData.specialization);
      submitData.append('experience', formData.experience);
      submitData.append('barCouncilId', formData.barCouncilId);
      submitData.append('practiceArea', formData.practiceArea);
      submitData.append('city', formData.city);
      submitData.append('state', formData.state);
      submitData.append('languages', formData.languages);
      submitData.append('about', formData.about);
      submitData.append('achievements', formData.achievements);
      submitData.append('consultationFees', formData.consultationFees);
      submitData.append('officeAddress', formData.officeAddress);
      submitData.append('availabilityDays', JSON.stringify(formData.availability.days));
      submitData.append('availabilityTimings', formData.availability.timings);
      
      // Append image
      submitData.append('profileImage', profileImage);

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await axios.post(`${backendUrl}/api/lawyer/register`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success("Registration submitted successfully! Please wait for admin approval.");
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          qualification: "",
          specialization: "",
          experience: "",
          barCouncilId: "",
          practiceArea: "",
          city: "",
          state: "",
          languages: "",
          about: "",
          achievements: "",
          consultationFees: "",
          availability: {
            days: [],
            timings: ""
          },
          officeAddress: ""
        });
        setProfileImage(null);
        setImagePreview("");
        
        // Navigate back to login or show success message
        if (onBackToLogin) {
          setTimeout(() => {
            onBackToLogin();
            toast.info("You can now login with your credentials after admin approval.");
          }, 2000);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // Server responded with error status
        toast.error(error.response.data.message || "Registration failed. Please try again.");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Unable to connect to server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Register as a Lawyer</h2>
            <p className="mt-2 text-gray-600">Join Legal Sathi and connect with clients seeking legal assistance</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden bg-gray-100">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img src={assets.upload_area} alt="Upload" className="w-16 h-16 opacity-50" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Click to upload profile photo</p>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📧 Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔒 Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔒 Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📞 Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎓 Qualification & Degrees *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  placeholder="e.g., LLB, LLM, BA LLB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚖️ Specialization *
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Years of Experience *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🆔 Bar Council Registration Number *
                </label>
                <input
                  type="text"
                  name="barCouncilId"
                  value={formData.barCouncilId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏛️ Court/Practice Area *
                </label>
                <select
                  name="practiceArea"
                  value={formData.practiceArea}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Practice Area</option>
                  {practiceAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🗣️ Languages Known *
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  placeholder="e.g., English, Hindi, Tamil"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💰 Consultation Fees (₹) *
                </label>
                <input
                  type="number"
                  name="consultationFees"
                  value={formData.consultationFees}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Enter 0 for free consultation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* About Me */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 About Me *
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description about yourself and your practice"
                required
              />
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏆 Notable Cases / Achievements (Optional)
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mention any notable cases, awards, or achievements"
              />
            </div>

            {/* Office Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Office Address *
              </label>
              <textarea
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Complete office address with pincode"
                required
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏰ Availability *
              </label>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Select available days:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {daysOfWeek.map(day => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.availability.days.includes(day)}
                          onChange={() => handleDayChange(day)}
                          className="mr-2"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Available timings:</label>
                  <input
                    type="text"
                    name="availability.timings"
                    value={formData.availability.timings}
                    onChange={handleInputChange}
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
              >
                Submit Registration for Approval
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                {onBackToLogin ? (
                  <button
                    onClick={onBackToLogin}
                    className="text-blue-600 hover:text-blue-500 font-medium underline"
                  >
                    Back to Login
                  </button>
                ) : (
                  <Link
                    to="/lawyer-login"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign In Here
                  </Link>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Image Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Adjust Your Profile Photo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag to reposition and resize the square frame to crop your image perfectly for your profile.
            </p>
            
            <div className="mb-4">
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                minWidth={100}
                minHeight={100}
              >
                <img
                  ref={imgRef}
                  src={cropSrc}
                  alt="Crop preview"
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                />
              </ReactCrop>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCropCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default LawyerRegistration;
