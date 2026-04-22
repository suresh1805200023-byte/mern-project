import { useEffect, useState } from "react";
import API from "../api";
import { useParams } from "react-router-dom";
import ReviewModal from "../components/ReviewModal";
import { CheckCircleIcon, PlayIcon, StarIcon } from "@heroicons/react/24/solid";

export default function CourseLessons() {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [showReview, setShowReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    fetchData();
  }, [courseId, refresh]);

  const fetchData = async () => {
    try {
      const [lessonRes, reviewRes, progressRes] = await Promise.all([
        API.get(`/lessons/${courseId}`),
        API.get(`/reviews/${courseId}`),
        API.get(`/progress/${courseId}/progress`)
      ]);

      setLessons(lessonRes.data);
      if (!activeLesson && lessonRes.data.length > 0) setActiveLesson(lessonRes.data[0]);
      
      setReviews(reviewRes.data.reviews || []);
      setAvg(reviewRes.data.avgRating || 0);
      setCompletedLessons(progressRes.data.completedLessons || []);
    } catch (err) {
      if (err.response?.status === 403) alert("Access Denied: Please purchase the course.");
      console.error(err);
    }
  };

  const markAsComplete = async (lessonId) => {
    const isAlreadyDone = completedLessons.some(id => id.toString() === lessonId);
    if (isAlreadyDone) return;

    try {
      await API.post(`/progress/${courseId}/${lessonId}`);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Progress update failed", err);
    }
  };

  const progressPercentage = lessons.length > 0 
    ? Math.round((completedLessons.length / lessons.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
   
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800">Learning Workspace</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{progressPercentage}% Complete</span>
            </div>
          </div>
          <button 
            onClick={() => setShowReview(true)}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-2xl font-black text-sm transition-all shadow-lg shadow-amber-200"
          >
            <StarIcon className="w-4 h-4" /> RATE COURSE
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:h-[calc(100vh-88px)]">
        
      
        <div className="lg:col-span-8 p-6 lg:p-10 overflow-y-auto">
          {activeLesson ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="aspect-video bg-black rounded-4xl overflow-hidden shadow-2xl mb-8 border-4 border-white">
                <video
                  key={activeLesson._id}
                  controls
                  autoPlay
                  onEnded={() => markAsComplete(activeLesson._id)}
                  className="w-full h-full object-cover"
                >
                  <source src={`http://localhost:5000/uploads/videos/${activeLesson.video}`} type="video/mp4" />
                </video>
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4">{activeLesson.title}</h1>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                {activeLesson.content}
              </div>

            
              <hr className="my-12 border-slate-200" />
              <div className="mb-10">
                <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  Student Feedback <span className="text-sm font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full">⭐ {avg}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 uppercase">
                          {r.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{r.user?.name}</p>
                          <div className="flex text-amber-400 tracking-tighter">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm italic">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">Select a lesson to begin</div>
          )}
        </div>

        
        <div className="lg:col-span-4 bg-white border-l border-slate-200 overflow-y-auto">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Course Content</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons?.some(id => id.toString() === lesson._id);
              const isActive = activeLesson?._id === lesson._id;

              return (
                <button
                  key={lesson._id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full flex items-start gap-4 p-6 transition-all text-left group ${
                    isActive ? 'bg-emerald-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 group-hover:border-slate-300'
                  }`}>
                    {isCompleted ? <CheckCircleIcon className="w-4 h-4 text-white" /> : <PlayIcon className={`w-2 h-2 ${isActive ? 'text-emerald-500' : 'text-slate-300'}`} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Lesson {index + 1}</p>
                    <h4 className={`font-bold text-sm ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {lesson.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">Video Content • 12:00</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      
      {showReview && (
        <ReviewModal
          courseId={courseId}
          onClose={() => setShowReview(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}