import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-gray-50 py-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* ------------ Left Section ------------ */}
          <div>
            <div className="flex items-center mb-4">
              <img className="w-40" src={assets.logo} alt="LegalSathi" />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your Trusted Partner in<br />
              Legal Excellence.
            </p>
          </div>

          {/* ------------ Center Section ------------ */}
          <div>
            <p className="text-lg font-semibold mb-6 text-gray-900">Important Links</p>
            <ul className="flex flex-col gap-3 text-gray-600 text-sm">
              <li>
                <Link to="/talk-to-lawyer" className="hover:text-blue-600 cursor-pointer transition-colors">
                  Book a Consultation
                </Link>
              </li>
              <li>
                <Link to="/lawyers" className="hover:text-blue-600 cursor-pointer transition-colors">
                  Our Lawyers
                </Link>
              </li>
              <li>
                <Link to="/legal-advice" className="hover:text-blue-600 cursor-pointer transition-colors">
                  Areas of Practice
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 cursor-pointer transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* ------------ Right Section ------------ */}
          <div>
            <p className="text-lg font-semibold mb-6 text-gray-900">GET IN TOUCH</p>
            <ul className="flex flex-col gap-3 text-gray-600 text-sm">
              <li>+91 9713567497</li>
              <li>contact@legalsathi.com</li>
              <li className="leading-relaxed">
                Address: 123 Vijay Nagar, Indore,<br />
                Madhya Pradesh, 452010, India
              </li>
            </ul>
          </div>
        </div>

        {/* ------------ Copyright Text ------------ */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            Copyright © 2025 LegalSathi - All Right Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;