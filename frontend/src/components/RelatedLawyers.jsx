import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedLawyers = ({ practiceArea, lawyerId }) => {
  const { lawyers } = useContext(AppContext);
  const navigate = useNavigate();

  const [relLawyers, setRelLawyers] = useState([]);

  useEffect(() => {
    if (lawyers.length > 0 && practiceArea) {
      const lawyersData = lawyers.filter(
        (lawyer) => lawyer.practiceArea === practiceArea && lawyer._id !== lawyerId
      );
      setRelLawyers(lawyersData);
    }
  }, [lawyers, practiceArea, lawyerId]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Related Lawyers</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Browse through our extensive list of trusted legal experts in this practice area.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relLawyers.slice(0, 5).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/consultation/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <img className="bg-blue-50" src={item.image} alt="" />
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm text-center ${
                  item.available ? "text-green-500" : "text-gray-500"
                }`}
              >
                <p
                  className={`w-2 h-2 ${
                    item.available ? "bg-green-500" : "bg-gray-500"
                  } rounded-full`}
                ></p>
                <p>{item.available ? "Available" : "Not Available"}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm ">{item.practiceArea}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-600">{item.rating || "4.8"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/lawyers");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        View all lawyers
      </button>
    </div>
  );
};

export default RelatedLawyers;
