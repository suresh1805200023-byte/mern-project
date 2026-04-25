import { useEffect, useState } from "react";
import API from "../api";
import { Plyr } from "plyr-react"; 

import "plyr/dist/plyr.css";
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusCircleIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  VideoCameraIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [lessonData, setLessonData] = useState({ title: "", content: "", video: null });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessonsMap, setLessonsMap] = useState({});
  const [openCourse, setOpenCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses/my-courses");
      setCourses(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchLessons = async (courseId) => {
    if (openCourse === courseId) {
      setOpenCourse(null);
      return;
    }
    try {
      const res = await API.get(`/lessons/${courseId}`);
      setLessonsMap(prev => ({ ...prev, [courseId]: res.data }));
      setOpenCourse(courseId);
    } catch (err) { console.error(err); }
  };

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure? This will delete all lessons in this course.")) {
      try {
        await API.delete(`/courses/${id}`);
        fetchCourses();
      } catch (err) { console.error(err); }
    }
  };

  const startEdit = (course) => {
    setEditingCourse(course._id);
    setForm({ title: course.title, description: course.description });
  };

  const updateCourse = async () => {
    try {
      await API.put(`/courses/${editingCourse}`, form);
      setEditingCourse(null);
      fetchCourses();
    } catch (err) { console.error(err); }
  };

  const handleLessonUpload = async () => {
    try {
      const data = new FormData();
      data.append("title", lessonData.title);
      data.append("content", lessonData.content);
      if (lessonData.video) data.append("video", lessonData.video);

      await API.post(`/lessons/${selectedCourse}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Lesson added successfully! ✅");
      setLessonData({ title: "", content: "", video: null });
      setSelectedCourse(null);
      fetchLessons(selectedCourse); 
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Instructor Workspace</h2>
        <p className="text-slate-500 font-medium mt-2">Manage your curriculum and review course performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/50">
            
           
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Live</span>
                  <span className="text-slate-300 text-xs">•</span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-tighter">
                    <BookOpenIcon className="w-3 h-3" />
                    {lessonsMap[course._id]?.length || 0} Modules
                  </div>
                </div>
                
                {editingCourse === course._id ? (
                  <div className="space-y-4 animate-in slide-in-from-left-2">
                    <input 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xl font-bold outline-none ring-2 ring-emerald-500"
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                    />
                    <textarea 
                      rows="3"
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-600 outline-none ring-2 ring-emerald-500"
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                    />
                    <div className="flex gap-3">
                      <button onClick={updateCourse} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-lg shadow-emerald-200">Save Changes</button>
                      <button onClick={() => setEditingCourse(null)} className="bg-slate-100 text-slate-500 px-8 py-3 rounded-2xl text-sm font-black">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-3xl font-black text-slate-800 mb-3">{course.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-lg max-w-3xl">{course.description}</p>
                  </>
                )}
              </div>

              <div className="flex md:flex-col gap-3 justify-start">
                <button onClick={() => startEdit(course)} className="p-4 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-3xl transition-all group">
                  <PencilSquareIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button onClick={() => deleteCourse(course._id)} className="p-4 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-3xl transition-all group">
                  <TrashIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

          
            <div className="bg-slate-50/50 border-t border-slate-50 p-6 flex flex-wrap gap-4">
              <button 
                onClick={() => fetchLessons(course._id)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black transition-all hover:border-emerald-500 hover:text-emerald-600 shadow-sm"
              >
                {openCourse === course._id ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                CURRICULUM MANAGER
              </button>
              
              <button 
                onClick={() => setSelectedCourse(course._id)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black transition-all hover:bg-slate-800 shadow-xl shadow-slate-200"
              >
                <PlusCircleIcon className="w-4 h-4" />
                ADD NEW LESSON
              </button>
            </div>

          
            {selectedCourse === course._id && (
              <div className="p-10 bg-emerald-50/30 border-t border-emerald-100 animate-in slide-in-from-top-4 duration-300">
                <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   New Module Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-emerald-700/50 uppercase tracking-widest px-1">Lesson Title</label>
                    <input 
                      placeholder="Introduction to Advanced UI..." 
                      className="bg-white border-none rounded-2xl p-4 text-sm outline-none ring-1 ring-emerald-100 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                      onChange={(e) => setLessonData({...lessonData, title: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-emerald-700/50 uppercase tracking-widest px-1">Video Resource</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="video/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        onChange={(e) => setLessonData({...lessonData, video: e.target.files[0]})}
                      />
                      <div className="bg-white border-2 border-dashed border-emerald-200 rounded-2xl p-4 text-xs text-center text-emerald-600 font-bold group-hover:bg-emerald-50 transition-all">
                        {lessonData.video ? lessonData.video.name : "Drop MP4 file or click to browse"}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] font-black text-emerald-700/50 uppercase tracking-widest px-1">Lesson Brief</label>
                    <textarea 
                      placeholder="Describe what will be covered in this video..." 
                      className="bg-white border-none rounded-2xl p-4 text-sm outline-none ring-1 ring-emerald-100 focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                      rows="3"
                      onChange={(e) => setLessonData({...lessonData, content: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={handleLessonUpload} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl text-xs font-black shadow-lg shadow-emerald-200 hover:scale-105 transition-transform">PUBLISH LESSON</button>
                  <button onClick={() => setSelectedCourse(null)} className="text-slate-400 font-bold text-xs uppercase tracking-widest px-4 hover:text-slate-600">Dismiss</button>
                </div>
              </div>
            )}

           
            {openCourse === course._id && (
              <div className="p-8 md:p-10 border-t border-slate-50 bg-slate-50/30 animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Syllabus Structure</h4>
                </div>

                {lessonsMap[course._id]?.length === 0 ? (
                  <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                    <p className="text-slate-400 font-bold">This curriculum is currently empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {lessonsMap[course._id]?.map((lesson, index) => (
                      <div key={lesson._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group">
                        <div className="p-6 flex items-start gap-4 border-b border-slate-50 bg-white group-hover:bg-slate-50 transition-colors">
                          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black">
                            {index + 1}
                          </div>
                          <div>
                            <h5 className="font-black text-slate-800 text-lg">{lesson.title}</h5>
                            <p className="text-sm text-slate-500 mt-1">{lesson.content}</p>
                          </div>
                        </div>

                        {lesson.video ? (
                          <div className="bg-slate-900 aspect-video">
                            <Plyr
                              source={{
                                type: 'video',
                                sources: [{
  src: `${import.meta.env.VITE_UPLOADS_VIDEOS_URL}/${lesson.video}`,
  type: 'video/mp4'
}]
                              }}
                              options={{ controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'] }}
                            />
                          </div>
                        ) : (
                          <div className="p-4 bg-amber-50 text-amber-600 text-[10px] font-black text-center uppercase tracking-widest">
                            No Video Preview Available
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}