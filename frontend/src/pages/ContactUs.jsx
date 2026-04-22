// src/pages/ContactUs.jsx
import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactUs() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-green-600 py-16 px-6 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">Contact Us</h1>
        <p className="text-green-100 max-w-2xl mx-auto text-lg">
          Have a question about a course or need help with your account? Our team is here to help you succeed.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600 shrink-0"><FaEnvelope size={20} /></div>
            <div>
              <h4 className="font-bold text-gray-900">Email Us</h4>
              <p className="text-sm text-gray-600">support@upskillhub.com</p>
              <p className="text-sm text-gray-600">info@upskillhub.com</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600 shrink-0"><FaPhoneAlt size={20} /></div>
            <div>
              <h4 className="font-bold text-gray-900">Call Us</h4>
              <p className="text-sm text-gray-600">+1 (555) 000-1234</p>
              <p className="text-sm text-gray-600">Mon-Fri, 9am-6pm EST</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600 shrink-0"><FaMapMarkerAlt size={20} /></div>
            <div>
              <h4 className="font-bold text-gray-900">Our Office</h4>
              <p className="text-sm text-gray-600">123 Education Lane, Tech Suite 500</p>
              <p className="text-sm text-gray-600">Silicon Valley, CA 94025</p>
            </div>
          </div>
        </div>

      
        
      </div>
    </div>
  );
}