import { useEffect, useState } from "react";
import API from "../api";
import { 
  ChartBarIcon, 
  CheckBadgeIcon, 
  ClockIcon, 
  FireIcon 
} from "@heroicons/react/24/outline";

export default function Progress() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await API.get("/enrollments/my-courses");

      // Simulation of real progress logic
      const withProgress = res.data.map((item) => ({
        ...item,
        progress: Math.floor(Math.random() * 101), // 0 to 100
        lastAccessed: "2 hours ago"
      }));

      setCourses(withProgress);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const totalCourses = courses.length;
  const completed = courses.filter(c => c.progress === 100).length;
  const inProgress = totalCourses - completed;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <ChartBarIcon className="w-8 h-8 text-indigo-500" />
          Learning Insights
        </h1>
        <p className="text-slate-500 font-medium mt-1">Track your growth and course completions.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <StatCard label="Total Courses" value={totalCourses} icon={FireIcon} color="bg-orange-500" />
          <StatCard label="In Progress" value={inProgress} icon={ClockIcon} color="bg-blue-500" />
          <StatCard label="Completed" value={completed} icon={CheckBadgeIcon} color="bg-emerald-500" />
        </div>
      </div>

      
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">Course Breakdown</h2>
          <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">
            Live Data
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {courses.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-bold italic">No active courses found.</p>
            </div>
          ) : (
            courses.map((item) => (
              <div key={item._id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  
                
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 font-black text-xl shadow-inner shrink-0">
                    {item.course?.title?.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                      {item.course?.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        Active: {item.lastAccessed}
                      </p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                        item.progress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.progress === 100 ? 'Completed' : 'Learning'}
                      </span>
                    </div>
                  </div>

                
                  <div className="w-full md:w-64 shrink-0">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                      <span className="text-sm font-black text-slate-800">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-50">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          item.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Sub-component
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
      <div className={`${color} p-3 rounded-2xl shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}