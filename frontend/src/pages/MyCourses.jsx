import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await API.get("/enrollments/my-courses");

      //  Deduplicate by course ID just in case
      const uniqueEnrollments = res.data.filter((v, i, a) => 
        a.findIndex(t => (t.course?._id === v.course?._id)) === i
      );

      const updatedCourses = await Promise.all(
        uniqueEnrollments.map(async (item) => {
          try {
            const [prog, rev] = await Promise.all([
              API.get(`/progress/${item.course._id}/progress`),
              API.get(`/reviews/${item.course._id}`),
            ]);
            return {
              ...item,
              progress: prog.data.percentage || 0,
              avgRating: rev.data.avgRating || 0,
              totalReviews: rev.data.total || 0,
            };
          } catch {
            return { ...item, progress: 0, avgRating: 0, totalReviews: 0 };
          }
        })
      );
      setCourses(updatedCourses);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((item) => (
        <div key={item.course._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          {item.course?.image && (
            <img 
              src={`http://localhost:5000/uploads/images/${item.course.image}`} 
              className="w-full h-40 object-cover rounded-2xl mb-4" 
              alt="course"
            />
          )}
          <h3 className="font-black text-slate-800 text-lg">{item.course?.title}</h3>
          
          
          <div className="mt-4">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${item.progress}%` }} 
              />
            </div>
            <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">
              {item.progress}% Completed
            </p>
          </div>

          <button 
            onClick={() => navigate(`/course/${item.course._id}`)}
            className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
          >
            Continue Learning
          </button>
        </div>
      ))}
    </div>
  );
}