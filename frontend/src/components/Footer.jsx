import React from 'react';
import { Link } from 'react-router-dom';
import { FaLightbulb, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <FaLightbulb className="text-green-500 text-2xl" />
              <span className="text-xl font-bold text-white">
                UpSkill<span className="text-green-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Empowering learners worldwide with affordable, high-quality education. Master the skills of tomorrow, today.
            </p>
          </div>

       
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-green-600 transition-colors">About Us</Link></li>
              <li><Link to="/help" className="hover:text-green-500 transition-colors">Help Center</Link></li>
              <li><Link to="/apply-teacher" className="hover:text-green-500 transition-colors">Become a Teacher</Link></li>
            </ul>
          </div>

    
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-green-500 cursor-pointer">Terms of Service</li>
              <li className="hover:text-green-500 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-green-500 cursor-pointer">Cookie Settings</li>
            </ul>
          </div>

       
          <div>
            <h4 className="text-white font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-600 hover:text-white transition-all"><FaFacebook size={18} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-600 hover:text-white transition-all"><FaTwitter size={18} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-600 hover:text-white transition-all"><FaLinkedin size={18} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-600 hover:text-white transition-all"><FaInstagram size={18} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} UpSkillHub Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}