import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedLawyers from "../components/RelatedLawyers";
import { toast } from "react-toastify";
import axios from "axios";

const Consultation = () => {
  const { lawyerId } = useParams();
  const { lawyers, currencySymbol, backendUrl, token, getLawyersData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();

  const [lawyerInfo, setLawyerInfo] = useState(null);
  const [lawyerSlots, setLawyerSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [consultationType, setConsultationType] = useState("video");

  const fetchLawyerInfo = async () => {
    const lawyerInfo = lawyers.find((lawyer) => lawyer._id === lawyerId);
    if (lawyerInfo) {
      // Initialize slots_booked if it doesn't exist
      if (!lawyerInfo.slots_booked) {
        lawyerInfo.slots_booked = {};
      }
      setLawyerInfo(lawyerInfo);
    }
  };

  const getAvailableSlots = async () => {
    setLawyerSlots([]);

    // Check if lawyerInfo exists and has slots_booked property
    if (!lawyerInfo || !lawyerInfo.slots_booked) {
      console.log("Lawyer info not available or slots_booked missing");
      return;
    }

    // getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        const isSlotAvailable =
          lawyerInfo.slots_booked[slotDate] &&
          Array.isArray(lawyerInfo.slots_booked[slotDate]) &&
          lawyerInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          // add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setLawyerSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookConsultation = async () => {
    const currentToken = localStorage.getItem("userToken");
    if (!currentToken) {
      toast.warn("Login to book consultation");
      return navigate("/login");
    }
    
    // Clean token - remove any extra quotes or whitespace
    const cleanToken = currentToken.replace(/['"]/g, '').trim();

    try {
      const date = lawyerSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/request-consultation",
        { 
          lawyerId, 
          consultationType, 
          message: `Consultation requested for ${slotDate} at ${slotTime}`,
          preferredTime: `${slotDate} at ${slotTime}`,
          slotDate,
          slotTime
        },
        { headers: { 
          Authorization: `Bearer ${cleanToken}`,
          token: cleanToken 
        }}
      );
      if (data.success) {
        toast.success(data.message);
        getLawyersData();
        // Add a small delay before navigation to ensure state updates
        setTimeout(() => {
          navigate("/my-consultations");
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to book consultation. Please try again.");
    }
  };

  useEffect(() => {
    fetchLawyerInfo();
  }, [lawyers, lawyerId]);

  useEffect(() => {
    getAvailableSlots();
  }, [lawyerInfo]);

  useEffect(() => {
    console.log(lawyerSlots);
  }, [lawyerSlots]);

  return (
    lawyerInfo && (
      <div>
        {/* -------------------- Lawyer Details -------------------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-[#5F6FFF]  w-full sm:max-w-72 rounded-lg"
              src={lawyerInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* -------------------- Lawyer Info : name, degree, experience -------------------- */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {lawyerInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {lawyerInfo.degree} - {lawyerInfo.practiceArea}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {lawyerInfo.experience}
              </button>
            </div>

            {/* -------------------- Lawyer About -------------------- */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-600 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {lawyerInfo.about}
              </p>
            </div>
            
            {/* -------------------- Rating and Reviews -------------------- */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm font-medium">{lawyerInfo.rating || "4.8"}</span>
                <span className="text-sm text-gray-500">({lawyerInfo.reviews || "150"} reviews)</span>
              </div>
            </div>
            
            <p className="text-gray-500 font-medium mt-4">
              Consultation fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {lawyerInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* -------------------- Consultation Type Selection -------------------- */}
        <div className="sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700">
          <p className="mb-4">Choose consultation type</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div 
              onClick={() => setConsultationType("video")}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                consultationType === "video" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Video Call</h4>
                  <p className="text-sm text-gray-600">₹800/30min</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => setConsultationType("phone")}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                consultationType === "phone" 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Phone Call</h4>
                  <p className="text-sm text-gray-600">₹600/30min</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => setConsultationType("chat")}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                consultationType === "chat" 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Chat</h4>
                  <p className="text-sm text-gray-600">₹400/session</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------- Booking Slots -------------------- */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Available consultation slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {lawyerSlots.length &&
              lawyerSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-[#5F6FFF]  text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {lawyerSlots.length &&
              lawyerSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-[#5F6FFF]  text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookConsultation}
            className="bg-[#5F6FFF]  text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book {consultationType} consultation
          </button>
        </div>

        {/* -------------------- Listing Related Lawyers -------------------- */}
        <RelatedLawyers lawyerId={lawyerId} practiceArea={lawyerInfo.practiceArea} />
      </div>
    )
  );
};

export default Consultation;
