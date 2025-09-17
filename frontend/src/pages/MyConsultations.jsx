import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyConsultations = () => {
  const { backendUrl, token, getLawyersData, lawyers } = useContext(AppContext);

  const [consultations, setConsultations] = useState([]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    if (!slotDate || typeof slotDate !== 'string') {
      return 'Date not available';
    }
    const dateArray = slotDate.split("_");
    if (dateArray.length !== 3) {
      return slotDate; // Return as-is if not in expected format
    }
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserConsultations = async () => {
    try {
      const currentToken = localStorage.getItem("userToken");
      if (!currentToken) {
        console.log('No user token found');
        toast.error('Please login to view consultations');
        return;
      }

      console.log('Fetching consultations with token:', currentToken.substring(0, 20) + '...');

      // Clean token - remove any extra quotes or whitespace
      const cleanToken = currentToken.replace(/['"]/g, '').trim();

      // Skip consultation requests API call since endpoint doesn't exist
      let consultationRequests = [];
      console.log('Skipping consultation-requests endpoint (404 error)');

      // Then try to get regular consultations
      let regularConsultations = [];
      try {
        console.log('Fetching regular consultations...');
        const { data } = await axios.get(backendUrl + "/api/user/consultations", {
          headers: { 
            Authorization: `Bearer ${cleanToken}`,
            token: cleanToken 
          },
        });
        console.log('Regular consultations response:', data);
        if (data.success) {
          regularConsultations = data.consultations || [];
          console.log('Found regular consultations:', regularConsultations.length);
        }
      } catch (consultationError) {
        console.log('Error fetching regular consultations:', consultationError.response?.data || consultationError.message);
      }

      // Combine all consultations
      let allConsultations = [...consultationRequests, ...regularConsultations];
      console.log('Total consultations found:', allConsultations.length);

      if (allConsultations.length > 0) {
        // Map consultations with lawyer data from assets
        const consultationsWithLawyerData = allConsultations.map(consultation => {
          const lawyer = lawyers.find(l => l._id === consultation.lawyerId);
          console.log('Mapping consultation:', consultation._id, 'with lawyer:', lawyer?.name || 'Unknown');
          return {
            ...consultation,
            lawyerData: lawyer || {
              name: "Unknown Lawyer",
              practiceArea: "General Practice",
              image: "/default-lawyer.png",
              address: { line1: "Address not available", line2: "" },
              fees: consultation.amount || 100
            }
          };
        });
        setConsultations(consultationsWithLawyerData.reverse());
        console.log('Set consultations:', consultationsWithLawyerData.length);
      } else {
        console.log('No consultations found, setting empty array');
        setConsultations([]);
      }
    } catch (error) {
      console.log('Error fetching consultations:', error);
      toast.error('Failed to load consultations');
    }
  };

  const cancelConsultation = async (consultationId) => {
    try {
      const currentToken = localStorage.getItem("userToken");
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-consultation",
        { consultationId },
        { headers: { 
          Authorization: `Bearer ${currentToken}`,
          token: currentToken 
        } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserConsultations();
        getLawyersData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const currentToken = localStorage.getItem("userToken");
    if (currentToken) {
      getUserConsultations();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My consultations
      </p>
      <div>
        {consultations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium text-gray-600">No consultations found</p>
              <p className="text-sm text-gray-500 mt-2">Your consultation requests will appear here once you book them.</p>
              <div className="mt-4">
                <button
                  onClick={() => window.location.href = '/lawyers'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Your First Consultation
                </button>
              </div>
            </div>
          </div>
        ) : (
          consultations.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={index}
            >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.lawyerData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.lawyerData.name}
              </p>
              <p>{item.lawyerData.practiceArea}</p>
              <p className="text-zinc-700 font-medium mt-1">Office Address:</p>
              <p className="text-xs">{item.lawyerData.address.line1}</p>
              <p className="text-xs">{item.lawyerData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>{" "}
                {item.slotDate ? `${slotDateFormat(item.slotDate)} | ${item.slotTime || 'Time not specified'}` : 
                 item.preferredTime || 'Date & time not specified'}
              </p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Consultation Fee:
                </span>{" "}
                ₹{item.amount || item.lawyerData.fees}
              </p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Type:
                </span>{" "}
                {item.consultationType ? item.consultationType.charAt(0).toUpperCase() + item.consultationType.slice(1) : 'Video'} Consultation
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {/* Show status badge */}
              {item.status && (
                <div className={`text-xs px-2 py-1 rounded text-center ${
                  item.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              )}
              
              {/* Show consultation button only if accepted */}
              {!item.cancelled && !item.isCompleted && item.status === 'accepted' && (
                <button 
                  onClick={() => {
                    const consultationType = item.consultationType || 'video';
                    window.location.href = `/${consultationType}-consultation`;
                  }}
                  className="text-sm text-white text-center sm:min-w-48 py-2 bg-green-600 rounded hover:bg-green-700 transition-all duration-300"
                >
                  Start {item.consultationType ? item.consultationType.charAt(0).toUpperCase() + item.consultationType.slice(1) : 'Video'} Consultation
                </button>
              )}
              
              {/* Show waiting message if pending */}
              {!item.cancelled && !item.isCompleted && item.status === 'pending' && (
                <div className="text-sm text-center sm:min-w-48 py-2 bg-yellow-100 text-yellow-800 rounded">
                  Waiting for lawyer approval
                </div>
              )}
              
              {/* Show rejected message */}
              {!item.cancelled && !item.isCompleted && item.status === 'rejected' && (
                <div className="text-sm text-center sm:min-w-48 py-2 bg-red-100 text-red-800 rounded">
                  Request rejected by lawyer
                </div>
              )}
              
              {/* Cancel button for consultation requests */}
              {!item.cancelled && !item.isCompleted && item.status && (
                <button
                  onClick={() => cancelConsultation(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Request
                </button>
              )}
              
              {/* Legacy buttons for old consultation format */}
              {!item.status && (
                <>
                  {!item.cancelled && !item.isCompleted && !item.payment && (
                    <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5F6FFF] hover:text-white transition-all duration-300">
                      Pay Online
                    </button>
                  )}
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelConsultation(item.id)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Cancel consultation
                    </button>
                  )}
                  {item.cancelled && !item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                      Consultation cancelled
                    </button>
                  )}
                  {item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                      Completed
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyConsultations;
