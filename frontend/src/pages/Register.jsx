import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import API from "../api";
import { FaLock, FaEnvelope, FaIdCard, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // VERY IMPORTANT
    try {
      await API.post("/auth/register", form);
      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    /* Fresh Light Green Mesh Gradient Background matching Login theme */
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-[#e6f9f0] via-[#c2f0db] to-[#99e6c4] px-4 py-12 font-sans">
      
      {/* Centered White Card Container */}
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl p-8 md:p-12 transition-transform duration-300">
        
        {/* Title Heading */}
        <h2 className="text-3xl font-extrabold text-green-800 text-center mb-10 tracking-tight">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-8">
          
          {/* Full Name Input Section */}
          <div className="relative border-b-2 border-gray-200 focus-within:border-green-500 transition-colors py-1">
            <label className="block text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="flex items-center">
              <FaIdCard className="text-gray-400 mr-3 text-sm flex-shrink-0" />
              <input
                type="text"
                required
                placeholder="Type your full name"
                className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300 py-1"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email Address Input Section */}
          <div className="relative border-b-2 border-gray-200 focus-within:border-green-500 transition-colors py-1">
            <label className="block text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
              Email
            </label>
            <div className="flex items-center">
              <FaEnvelope className="text-gray-400 mr-3 text-sm flex-shrink-0" />
              <input
                type="email"
                required
                placeholder="Type your email address"
                className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300 py-1"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Input Section */}
          <div className="relative border-b-2 border-gray-200 focus-within:border-green-500 transition-colors py-1">
            <label className="block text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="flex items-center">
              <FaLock className="text-gray-400 mr-3 text-sm flex-shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a strong password"
                className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300 py-1 pr-8"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 text-gray-400 hover:text-green-600 transition-colors focus:outline-none"
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
          </div>

          {/* Green Gradient Action Register Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-full font-bold text-white tracking-wide shadow-md shadow-green-100 bg-gradient-to-r from-[#5cd699] via-[#2eb872] to-[#1f7a4b] hover:opacity-95 transform active:scale-[0.99] transition-all text-sm uppercase"
            >
              REGISTER
            </button>
          </div>
        </form>

        {/* Footer/Navigation Sign up Section matching Login component architecture */}
        <div className="mt-20 text-center space-y-3">
          <p className="text-xs text-gray-400 tracking-wide">
            Or Sign Up Using
          </p>
          <div>
            <Link 
              to="/login" 
              className="text-xs font-bold text-green-700 tracking-wider hover:text-green-500 transition-colors uppercase"
            >
              LOG IN
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}