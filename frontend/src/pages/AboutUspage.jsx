import React from 'react';
import { FaRocket, FaUsers, FaGlobe, FaLightbulb } from 'react-icons/fa';
import heroImage from "../assets/hero.jpg"; 

export default function AboutUspage() {
  const stats = [
    { label: "Active Students", value: "5,000+", icon: <FaUsers className="text-green-600" /> },
    { label: "Expert Mentors", value: "120+", icon: <FaLightbulb className="text-green-600" /> },
    { label: "Global Courses", value: "450+", icon: <FaGlobe className="text-green-600" /> },
    { label: "Success Rate", value: "94%", icon: <FaRocket className="text-green-600" /> },
  ];

  return (
    <div className="bg-white min-h-screen">
    
      <div className="bg-linear-to-br from-green-50 to-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Empowering the next generation of <br />
            <span className="text-green-600">Digital Pioneers</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            UpSkillHub was founded on a simple belief: high-quality education should be accessible, 
            engaging, and career-focused. We bridge the gap between traditional learning and 
            real-world industry demands.
          </p>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            To provide a platform where anyone, anywhere, can learn the skills they need to transform their lives. 
            Whether you're looking to switch careers, level up at work, or start a new hobby, 
            UpSkillHub provides the tools and mentorship to make it happen.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-1 rounded-full"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>
              <span className="text-gray-700"><strong>Practical Learning:</strong> Projects based on real-world scenarios.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-1 rounded-full"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>
              <span className="text-gray-700"><strong>Expert Guidance:</strong> Taught by industry professionals.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-1 rounded-full"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>
              <span className="text-gray-700"><strong>Flexible Access:</strong> Learn at your own pace, anytime, anywhere.</span>
            </li>
          </ul>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-green-200 rounded-3xl rotate-3 opacity-30"></div>
          <img 
            src={heroImage} 
            alt="Students learning" 
            className="relative z-10 rounded-3xl shadow-xl border-4 border-white"
          />
        </div>
      </div>

      
      <div className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-center mb-4 text-2xl">{stat.icon}</div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Join a Global Community</h2>
        <p className="text-gray-600 mb-10 leading-relaxed">
          We are more than just an e-learning platform; we are a community of over 5,000+ 
          lifelong learners supporting each other. Are you ready to take the first step?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
            Browse All Courses
          </button>
          <button className="bg-white text-gray-900 border border-gray-200 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}