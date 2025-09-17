import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const Lawyers = () => {
  const { practiceArea } = useParams();
  const [filterLawyers, setFilterLawyers] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();

  const { lawyers } = useContext(AppContext);
  const { getUserRole } = useAuth();
  
  const userRole = getUserRole();

  const applyFilter = () => {
    if (practiceArea) {
      // Decode the URL parameter to handle spaces properly
      const decodedPracticeArea = decodeURIComponent(practiceArea);
      const filtered = lawyers.filter((lawyer) => lawyer.practiceArea === decodedPracticeArea);
      setFilterLawyers(filtered);
    } else {
      // Group lawyers by practice area when showing all
      const practiceAreas = ['Corporate Law', 'Criminal Law', 'Family Law', 'Real Estate Law', 'Employment Law', 'Immigration Law'];
      const groupedLawyers = [];
      
      practiceAreas.forEach(area => {
        const lawyersInArea = lawyers.filter(lawyer => lawyer.practiceArea === area);
        if (lawyersInArea.length > 0) {
          groupedLawyers.push({ type: 'header', practiceArea: area });
          groupedLawyers.push(...lawyersInArea);
        }
      });
      
      setFilterLawyers(groupedLawyers);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [lawyers, practiceArea]);

  return (
    <div>
      <p className="text-gray-600">Browse through our expert lawyers by practice area.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-[#5F6FFF]  text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() => {
              const decodedArea = decodeURIComponent(practiceArea || "");
              decodedArea === "Corporate Law"
                ? navigate("/lawyers")
                : navigate(`/lawyers/${encodeURIComponent("Corporate Law")}`)
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              decodeURIComponent(practiceArea || "") === "Corporate Law"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Corporate Law
          </p>
          <p
            onClick={() => {
              const decodedArea = decodeURIComponent(practiceArea || "");
              decodedArea === "Criminal Law"
                ? navigate("/lawyers")
                : navigate(`/lawyers/${encodeURIComponent("Criminal Law")}`)
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              decodeURIComponent(practiceArea || "") === "Criminal Law" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Criminal Law
          </p>
          <p
            onClick={() => {
              const decodedArea = decodeURIComponent(practiceArea || "");
              decodedArea === "Family Law"
                ? navigate("/lawyers")
                : navigate(`/lawyers/${encodeURIComponent("Family Law")}`)
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              decodeURIComponent(practiceArea || "") === "Family Law" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Family Law
          </p>
          <p
            onClick={() => {
              const decodedArea = decodeURIComponent(practiceArea || "");
              decodedArea === "Real Estate Law"
                ? navigate("/lawyers")
                : navigate(`/lawyers/${encodeURIComponent("Real Estate Law")}`)
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              decodeURIComponent(practiceArea || "") === "Real Estate Law" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Real Estate Law
          </p>
          <p
            onClick={() => {
              const decodedArea = decodeURIComponent(practiceArea || "");
              decodedArea === "Employment Law"
                ? navigate("/lawyers")
                : navigate(`/lawyers/${encodeURIComponent("Employment Law")}`)
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              decodeURIComponent(practiceArea || "") === "Employment Law" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Employment Law
          </p>
          <p
            onClick={() => {
              const decodedArea = decodeURIComponent(practiceArea || "");
              decodedArea === "Immigration Law"
                ? navigate("/lawyers")
                : navigate(`/lawyers/${encodeURIComponent("Immigration Law")}`)
            }}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              decodeURIComponent(practiceArea || "") === "Immigration Law"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Immigration Law
          </p>
        </div>
        <div className="w-full">
          {filterLawyers.filter(item => item != null).map((item, index) => {
            // Render practice area header
            if (item.type === 'header') {
              return (
                <div key={index} className="mb-6 mt-8 first:mt-0">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">
                    {item.practiceArea}
                  </h2>
                </div>
              );
            }
            
            // Skip if item is null or doesn't have required properties
            if (!item || !item._id || !item.name) {
              return null;
            }
            
            // Render lawyer card
            return (
              <div key={index} className="mb-6">
                <div 
                  onClick={() => navigate(`/lawyer/${item._id}`)}
                  className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-2px] transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 sm:h-48 w-full h-48">
                      <img className="w-full h-full object-cover bg-blue-50" src={item.image} alt="" />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-gray-900 text-xl font-bold">{item.name}</p>
                          <p className="text-blue-600 text-sm font-medium">{item.practiceArea}</p>
                          <p className="text-gray-600 text-sm">{item.degree} • {item.experience}</p>
                        </div>
                        <div
                          className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${
                            item?.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <p
                            className={`w-2 h-2 ${
                              item?.available ? "bg-green-500" : "bg-gray-500"
                            } rounded-full`}
                          ></p>
                          <p>{item?.available ? "Available" : "Not Available"}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.about}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium text-gray-700">{item.rating || "4.8"}</span>
                            <span className="text-sm text-gray-500">({item.reviews || "150"})</span>
                          </div>
                          <p className="text-lg font-bold text-blue-600">₹{item.fees || "500"}</p>
                        </div>
                        
                        {/* Action Buttons - Only show for authenticated non-lawyers */}
                        {userRole !== 'lawyer' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const token = localStorage.getItem('userToken');
                              if (!token) {
                                navigate('/login');
                                return;
                              }
                              navigate(`/book-appointment/${item._id}`, { 
                                state: { 
                                  lawyer: item,
                                  consultationType: 'consultation'
                                }
                              });
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg transition-colors font-medium"
                          >
                            📅 Book Consultation
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Lawyers;
