import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import API from "../api";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents page reload on form submit
    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "admin") navigate("/admin");
      else if (role === "teacher") navigate("/teacher");
      else navigate("/student");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    /* Mesh Gradient Background matching your UI mockup */
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-[#69d9e5] via-[#a38bf5] to-[#f434e2] px-4 py-12 font-sans">
      
      {/* Centered White Card Container */}
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl p-8 md:p-12 transition-transform duration-300">
        
        {/* Title Heading */}
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10 tracking-tight">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-8">
          
          {/* Username/Email Input Section */}
          <div className="relative border-b-2 border-gray-200 focus-within:border-gray-400 transition-colors py-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="flex items-center">
              <FaUser className="text-gray-400 mr-3 text-sm flex-shrink-0" />
              <input
                type="email"
                required
                placeholder="Type your username or email"
                className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300 py-1"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Input Section */}
          <div className="relative border-b-2 border-gray-200 focus-within:border-gray-400 transition-colors py-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="flex items-center">
              <FaLock className="text-gray-400 mr-3 text-sm flex-shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Type your password"
                className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300 py-1 pr-8"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              {/* Optional: Interactive View/Hide Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link alignment */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Gradient Action Login Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-full font-bold text-white tracking-wide shadow-md shadow-purple-200 bg-gradient-to-r from-[#4ae2e2] via-[#9476fa] to-[#f43cda] hover:opacity-95 transform active:scale-[0.99] transition-all text-sm uppercase"
            >
              LOGIN
            </button>
          </div>
        </form>

        {/* Footer/Navigation Sign up Section */}
        <div className="mt-20 text-center space-y-3">
          <p className="text-xs text-gray-500 tracking-wide">
            Or Sign Up Using
          </p>
          <div>
            <Link 
              to="/register" 
              className="text-xs font-bold text-gray-800 tracking-wider hover:text-purple-600 transition-colors uppercase"
            >
              SIGN UP
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}