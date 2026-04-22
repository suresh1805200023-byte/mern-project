import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import { 
  CheckCircleIcon, 
  ArrowRightIcon, 
  BookOpenIcon, 
  SparklesIcon 
} from "@heroicons/react/24/outline";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const query = new URLSearchParams(location.search);
  const courseId = query.get("courseId");
  const courseIds = query.get("courseIds");

  useEffect(() => {
    enrollCourse();
  }, []);

  const enrollCourse = async () => {
    try {
      const idsFromQuery = courseIds
        ? courseIds.split(",").map((id) => id.trim()).filter(Boolean)
        : courseId
        ? [courseId]
        : [];

      if (!idsFromQuery.length) {
        setMessage("Invalid course selection.");
        setLoading(false);
        return;
      }

      const res = await API.post("/payment/success", { courseIds: idsFromQuery });
      const purchasedIds = new Set(idsFromQuery);
      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = currentCart.filter((id) => !purchasedIds.has(id));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdate"));

      const enrolledCount = res.data?.enrolledCount ?? idsFromQuery.length;
      setMessage(
        enrolledCount > 1
          ? `Your enrollment is confirmed for ${enrolledCount} courses. Happy learning!`
          : "Your enrollment is confirmed. Welcome to the course!"
      );
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message === "Already enrolled") {
        setMessage("You are already enrolled in the selected course(s). Ready to continue learning?");
      } else {
        setMessage("We encountered an issue updating your access. Please contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden animate-in zoom-in duration-500">
        
      
        <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative inline-block">
            {loading ? (
              <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <div className="bg-emerald-500 p-4 rounded-3xl shadow-xl shadow-emerald-500/20 animate-bounce">
                <CheckCircleIcon className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-black text-white mt-8 tracking-tight">
            {loading ? "Confirming Access..." : "Payment Successful!"}
          </h1>
        </div>

     
        <div className="p-10 text-center">
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            {message}
          </p>

          {!loading && (
            <div className="mt-10 space-y-4">
              <button
                onClick={() => navigate("/student")}
                className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-emerald-100"
              >
                <BookOpenIcon className="w-5 h-5" />
                GO TO MY DASHBOARD
                <ArrowRightIcon className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-6 pt-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <SparklesIcon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Instant Access</span>
                </div>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Lifetime Validity</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {!loading && (
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-slate-400 text-xs font-bold">
              Having trouble? <span className="text-emerald-600 cursor-pointer hover:underline" onClick={() => navigate('/help')}>Visit Help Center</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}