import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopLawyers = () => {
  const navigate = useNavigate();
  const { lawyers } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Lawyers to Consult</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Browse through our extensive list of trusted legal experts and book your consultation.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {lawyers.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/consultation/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <img
              className="bg-blue-50 w-full "
              src={item.image}
              alt={item.name}
            />
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
              <p className="text-gray-600 text-sm">{item.practiceArea}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-600">{item.rating || "4.8"}</span>
                <span className="text-sm text-gray-500">({item.reviews || "150"})</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">₹{item.fees || "500"}/consultation</p>
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

export default TopLawyers;
