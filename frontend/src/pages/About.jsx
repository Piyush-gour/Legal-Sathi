import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ABOUT <span className="text-blue-600">US</span>
          </h1>
        </div>

        {/* Main Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Image Section */}
            <div className="lg:w-1/3">
              <div className="relative">
                <img
                  className="w-full rounded-lg shadow-md"
                  src={assets.about_image}
                  alt="Legal professionals"
                />
                <div className="absolute inset-0 bg-blue-600 bg-opacity-10 rounded-lg"></div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-2/3 space-y-6">
              <div>
                <p className="text-gray-700 leading-relaxed text-base">
                  Welcome To LegalSathi, Your Trusted Partner In Managing Your Legal Needs Conveniently And Efficiently. 
                  At LegalSathi, We Understand The Challenges Individuals Face When It Comes To Scheduling Legal 
                  Consultations And Managing Their Legal Matters.
                </p>
              </div>

              <div>
                <p className="text-gray-700 leading-relaxed text-base">
                  LegalSathi Is Committed To Excellence In Legal Technology. We Continuously Strive To Enhance Our 
                  Platform, Integrating The Latest Advancements To Improve User Experience And Deliver Superior Service. 
                  Whether You're Booking Your First Consultation Or Managing Ongoing Legal Matters, LegalSathi Is Here To Support You 
                  Every Step Of The Way.
                </p>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  Our Vision At LegalSathi Is To Create A Seamless Legal Experience For Every User. We Aim To Bridge The 
                  Gap Between Clients And Legal Professionals, Making It Easier For You To Access The Legal Care You Need, When 
                  You Need It.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            WHY <span className="text-blue-600">CHOOSE US</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Efficiency Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">EFFICIENCY:</h3>
                <p className="text-gray-600 leading-relaxed">
                  Streamlined Legal Consultation Scheduling That Fits Into Your Busy Lifestyle.
                </p>
              </div>
            </div>

            {/* Convenience Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">CONVENIENCE:</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access To A Network Of Trusted Legal Professionals In Your Area.
                </p>
              </div>
            </div>

            {/* Personalization Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-purple-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">PERSONALIZATION:</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tailored Recommendations And Reminders To Help You Stay On Top Of Your Legal Matters.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Verified Lawyers</h4>
              <p className="text-sm text-gray-600">All lawyers are verified and licensed professionals</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Confidential</h4>
              <p className="text-sm text-gray-600">Complete privacy and confidentiality guaranteed</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Instant Connect</h4>
              <p className="text-sm text-gray-600">Connect with lawyers within minutes</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">24/7 Available</h4>
              <p className="text-sm text-gray-600">Round-the-clock legal assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;