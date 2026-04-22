import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Star, 
  Users, 
  CheckCircle2, 
  PlayCircle, 
  Clock, 
  Globe, 
  Award, 
  ChevronRight 
} from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import API from "../api";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await API.get(`/courses/${id}`);
      setCourse(res.data.course);
      setReviews(res.data.reviews);
      setAvg(res.data.avgRating);
    } catch (err) { console.error(err); }
  };

  const checkEnrollment = async () => {
    try {
      const res = await API.get("/enrollments/my-courses");
      const enrolled = res.data.some((item) => item.course._id === id);
      setIsEnrolled(enrolled);
    } catch (err) { console.error(err); }
  };

  const handleBuy = async () => {
    try {
      const res = await API.post("/payment/checkout", { courseId: id });
      window.location.href = res.data.url;
    } catch (err) { console.error(err); }
  };

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.includes(id)) {
      cart.push(id);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdate"));
    }
  };

  if (!course) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      
     
      <div className="bg-[#0f172a] text-white pt-16 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="md:w-2/3 space-y-6">
            <nav className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-widest">
              <span>Development</span> <ChevronRight size={14} /> <span>Web Design</span>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
              {course.title}
            </h1>
            
            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
              {course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-medium text-lg">{avg || 0}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(avg) ? "#fbbf24" : "none"} 
                      className={i < Math.floor(avg) ? "text-amber-400" : "text-slate-600"} 
                    />
                  ))}
                </div>
                <span className="text-slate-400 text-sm underline">({reviews.length} ratings)</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <Users size={18} className="text-emerald-500" />
                <span>1,240 students enrolled</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-medium text-white uppercase shadow-lg">
                {course.teacher?.name?.charAt(0)}
              </div>
              <p className="text-slate-300 text-sm">
                Created by <span className="text-emerald-400 font-semibold underline cursor-pointer hover:text-emerald-300 transition-colors">{course.teacher?.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

     
      <div className="max-w-6xl mx-auto px-6 -mt-20 grid md:grid-cols-3 gap-12">
        
       
        <div className="md:col-span-2 space-y-10">
          
          <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl font-medium text-slate-900 mb-6">What you'll learn</h2>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              {course.whatYouWillLearn?.map((item, i) => (
                <div key={i} className="flex gap-3 text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 space-y-10">
            <section>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Requirements</h2>
              <ul className="grid gap-3">
                {course.requirements?.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {course.description}
              </p>
            </section>

           
            <section className="pt-10 border-t border-slate-100">
              <h2 className="text-2xl font-medium text-slate-900 mb-8 flex items-center gap-3">
                <Star size={28} className="text-amber-400 fill-amber-400" />
                Student Feedback
              </h2>
              <div className="space-y-6">
                {reviews.map((r) => (
                  <div key={r._id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-11 h-11 bg-white border border-slate-200 rounded-full flex items-center justify-center font-medium text-emerald-600">
                        {r.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{r.user?.name}</p>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

      
        <div className="relative">
          <div className="sticky top-10 bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden">
          
            
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-slate-900 font-mono">₹{course.price}</span>
                <span className="text-slate-400 line-through text-lg">₹{course.price * 2}</span>
                <span className="text-emerald-600 text-sm font-medium ml-auto">50% OFF</span>
              </div>

              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/learn/${course._id}`)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle size={20} /> RESUME LEARNING
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleBuy}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-medium shadow-xl transition-all"
                  >
                    ENROLL NOW
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 border border-slate-300 hover:border-slate-500 text-slate-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> ADD TO CART
                  </button>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-medium text-slate-900 uppercase tracking-widest">Includes:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock size={16} className="text-slate-400" /> 18.5 hours video
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Globe size={16} className="text-slate-400" /> Full lifetime access
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Award size={16} className="text-slate-400" /> Certificate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}