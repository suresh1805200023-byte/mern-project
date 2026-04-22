import { useEffect, useState } from "react";
import API from "../api";
import { 
  AcademicCapIcon, 
  ArrowDownTrayIcon, 
  TrophyIcon,
  CheckBadgeIcon 
} from "@heroicons/react/24/outline";

export default function Certificates() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await API.get("/enrollments/my-courses");

      const completedCourses = await Promise.all(
        res.data.map(async (item) => {
          try {
            const progressRes = await API.get(
              `/progress/${item.course._id}/progress`
            );
            if (progressRes.data.percentage === 100) return item;
          } catch {}
          return null;
        })
      );

      setCourses(completedCourses.filter(Boolean));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (courseId) => {
    try {
      const res = await API.get(`/certificate/${courseId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Certificate-${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
    } catch {
      alert("Error generating certificate. Please try again later. ❌");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Verifying Achievements...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      
  
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Your Achievements</h2>
          <p className="text-slate-500 font-medium mt-2">Download and share your earned credentials.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-amber-50 rounded-2xl border border-amber-100">
          <TrophyIcon className="w-6 h-6 text-amber-500" />
          <span className="text-amber-700 font-black text-sm">{courses.length} Completed</span>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <AcademicCapIcon className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-800">No certificates yet</h3>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">
            Once you complete 100% of a course's lessons, your official certificate will appear here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((item) => (
            <div 
              key={item._id} 
              className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 overflow-hidden"
            >
            
              <div className="bg-slate-900 h-32 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl" />
                </div>
                <CheckBadgeIcon className="w-12 h-12 text-white/20 group-hover:text-emerald-400/50 transition-colors duration-500" />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    Verified
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-slate-800 leading-tight mb-6 min-h-12">
                  {item.course.title}
                </h3>

                <button
                  onClick={() => downloadCertificate(item.course._id)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white px-6 py-4 rounded-2xl text-xs font-black transition-all duration-300 active:scale-95 shadow-xl shadow-slate-200"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  DOWNLOAD PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}