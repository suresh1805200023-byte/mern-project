import { useState } from "react";
import API from "../api";

export default function BecomeTeacher() {
  const [form, setForm] = useState({
    website: "",
    linkedin: "",
    github: "",
    experience: "",
    projects: "",
  });

  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false); // New state for terms

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const apply = async () => {
    if (!form.linkedin || !form.github) {
      alert("LinkedIn and GitHub are required");
      return;
    }
    if (!agreed) {
      alert("You must agree to the Terms and Conditions");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("website", form.website);
      formData.append("linkedin", form.linkedin);
      formData.append("github", form.github);
      formData.append("experience", form.experience);
      formData.append("projects", form.projects);
      if (resume) formData.append("resume", resume);

      const res = await API.post("/application/apply", formData);
      console.log(res.data);
      setStatus("pending");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md border border-green-100">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Received!</h2>
          <p className="text-gray-600 mb-6">
            We've received your application to join the LMS faculty. Our team will review your profile and get back to you via email.
          </p>
          <button onClick={() => window.location.href = '/'} className="text-green-600 font-semibold hover:underline">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
        
        {/* Left Side: Info Branding */}
        <div className="md:w-1/3 bg-green-600 p-10 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold mb-4 text-white">Join Our Faculty</h2>
            <p className="text-green-100 leading-relaxed">
              Empower the next generation of developers. Share your real-world expertise and earn 70% of every course sale.
            </p>
          </div>
          <div className="mt-10 space-y-4 text-sm text-green-50">
            <div className="flex items-center gap-3">
              <span className="bg-green-500 p-2 rounded-full">✓</span> Weekly Payouts
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-green-500 p-2 rounded-full">✓</span> Global Reach
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-green-500 p-2 rounded-full">✓</span> Full Content Ownership
            </div>
          </div>
        </div>

        
        <div className="md:w-2/3 p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Personal Website</label>
              <input type="text" name="website" placeholder="https://..." className="w-full border-b-2 border-gray-100 py-2 focus:border-green-400 outline-none transition-colors" onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">LinkedIn *</label>
              <input type="text" name="linkedin" placeholder="linkedin.com/in/..." className="w-full border-b-2 border-gray-100 py-2 focus:border-green-400 outline-none transition-colors" onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">GitHub *</label>
              <input type="text" name="github" placeholder="github.com/..." className="w-full border-b-2 border-gray-100 py-2 focus:border-green-400 outline-none transition-colors" onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Resume (PDF)</label>
              <input type="file" accept=".pdf" className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" onChange={handleFileChange} />
            </div>
          </div>

          <div className="space-y-4">
            <textarea name="experience" placeholder="Describe your teaching or industry experience..." rows={2} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-400 outline-none" onChange={handleChange} />
            <textarea name="projects" placeholder="Tell us about the biggest project you've built..." rows={2} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-400 outline-none" onChange={handleChange} />
          </div>

        
          <div className="mt-8">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Instructor Terms</label>
            <div className="h-32 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3 text-[10px] text-gray-500 mb-4 leading-relaxed">
              <p className="font-bold text-gray-700">1. Revenue Share:</p>
              <p>Teachers receive 70% of net revenue (Sale price - gateway fees - taxes). Payouts are made monthly for balances over ₹1,000.</p>
              <p className="font-bold text-gray-700 mt-2">2. Content Integrity:</p>
              <p>Courses must be original. Plagiarism results in immediate termination and forfeiture of earnings.</p>
              <p className="font-bold text-gray-700 mt-2">3. Jurisdiction:</p>
              <p>This agreement is governed by the laws of India, with jurisdiction in Chennai, Tamil Nadu.</p>
              <p className="mt-2 italic">Read the full agreement at LMS.com/terms/instructor.</p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <input 
                type="checkbox" 
                id="agree" 
                className="w-5 h-5 accent-green-600 rounded cursor-pointer"
                onChange={(e) => setAgreed(e.target.checked)} 
              />
              <label htmlFor="agree" className="text-sm text-gray-600 cursor-pointer select-none">
                I agree to the Instructor Agreement and fulfill the 18+ age requirement.
              </label>
            </div>

            <button
              onClick={apply}
              disabled={loading || !agreed}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition duration-300 ${
                loading || !agreed ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 hover:shadow-green-200"
              }`}
            >
              {loading ? "Submitting..." : "Apply to Join 🚀"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}