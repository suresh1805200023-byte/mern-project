import { useState, useEffect } from "react";
import API from "../api";
import CreateCourseSection from "./CreateCourseSection";
import CoursesSection from "./CourseSection";
import ProfileSection from "../components/ProfileSection";
import NotificationsPanel from "../components/NotificationsPanel";

export default function TeacherDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("analytics");
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (active === "analytics") fetchStats();
  }, [active]);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/instructor/me");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/instructor/dashboard");
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased">
      
    
      <div className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="p-8">
          <h2 className="text-2xl font-black tracking-tighter text-emerald-400 mb-8">
            UpSkillHub <span className="text-white font-light text-sm uppercase tracking-widest block">Instructor</span>
          </h2>

        
          {profile && (
            <div className="flex items-center gap-4 mb-10 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <div className="relative">
                {profile.profilePic ? (
                  <img
                    src={`http://localhost:5000/uploads/${profile.profilePic}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    alt="profile"
                  />
                ) : (
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center font-bold">
                    {profile.name?.charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-sm truncate">{profile.name}</h3>
                <p className="text-[10px] text-slate-400 truncate uppercase tracking-tighter">Pro Instructor</p>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            {[
              { id: "analytics", label: "Dashboard",  },
              { id: "courses", label: "My Courses",  },
              { id: "create", label: "New Course", },
              { id: "profile", label: "Settings",  },
              { id: "notifications", label: "Notifications" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  active === item.id 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8 border-t border-slate-800">
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">v2.4 Stable</p>
        </div>
      </div>

      
      <div className="flex-1 overflow-y-auto px-12 py-10">
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Morning, Instructor</p>
            <h1 className="text-4xl font-black text-slate-800">
              Welcome, {user?.name.split(" ")[0]} 👋
            </h1>
          </div>
          <div className="text-right">
             <p className="text-slate-400 text-xs font-bold">Total Payout</p>
             <p className="text-2xl font-black text-slate-800">₹{stats?.totalRevenue.toLocaleString() || '0'}</p>
          </div>
        </header>

     
        {active === "analytics" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!stats ? (
              <div className="flex gap-4">
                 {[1,2,3,4].map(i => <div key={i} className="h-32 flex-1 bg-slate-200 animate-pulse rounded-3xl"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard label="Live Courses" value={stats.totalCourses} color="text-slate-800" />
                <StatCard label="Total Students" value={stats.totalStudents} color="text-blue-600" />
                <StatCard label="Avg Rating" value={`⭐ ${stats.avgRating}`} color="text-amber-500" />
                <StatCard label="Net Earnings" value={`₹${stats.totalRevenue}`} color="text-emerald-600" isBold />
              </div>
            )}
            
           
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 min-h-75 flex items-center justify-center border-dashed">
               <p className="text-slate-400 font-medium">Sales Charting Component Coming Soon</p>
            </div>
          </div>
        )}

      
        <div className="animate-in fade-in duration-300">
          {active === "profile" && <ProfileSection profile={profile} fetchProfile={fetchProfile} />}
          {active === "courses" && <CoursesSection />}
          {active === "create" && <CreateCourseSection />}
          {active === "notifications" && <NotificationsPanel />}
        </div>

      </div>
    </div>
  );
}

// Sub-component for reuse
function StatCard({ label, value, color, isBold }) {
  return (
    <div className="bg-white p-7 rounded-4xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02]">
      <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-3">{label}</h3>
      <p className={`text-3xl font-black ${color}`}>
        {value}
      </p>
    </div>
  );
}