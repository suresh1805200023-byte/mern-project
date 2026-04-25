// src/pages/Home.jsx
import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Rocket, ChevronRight } from "lucide-react"; 
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import heroImage from "../assets/hero.jpg";

export default function Home() {
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  const fetchEnrolledCourses = async () => {
    try {
      const res = await API.get("/enrollments/my-courses");
      setEnrolledCourses((res.data || []).map((item) => item.course._id));
    } catch (err) { console.error(err); }
  };

  const fetchTrending = async () => {
    try {
      const res = await API.get("/courses/trending");
      setTrendingCourses(res.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchFeatured = async () => {
    try {
      const res = await API.get("/courses/featured");
      setFeaturedCourses(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchEnrolledCourses();
    fetchTrending();
    fetchFeatured();
  }, []);

  const handleBuy = async (courseId) => {
    try {
      localStorage.setItem("courseId", courseId);
      const res = await API.post("/payment/checkout", { courseId });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Payment initiation failed. Please try again.");
    }
  };

  const handleAddToCart = (courseId) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.includes(courseId)) {
      cart.push(courseId);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdate"));
    }
  };

  const CourseCard = (course) => {
    const isEnrolled = enrolledCourses.includes(course._id);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
      const syncWishlistState = () => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setIsWishlisted(wishlist.includes(course._id));
      };
      syncWishlistState();
      window.addEventListener("wishlistUpdate", syncWishlistState);
      return () => window.removeEventListener("wishlistUpdate", syncWishlistState);
    }, [course._id]);

    const toggleWishlist = (e) => {
      e.stopPropagation();
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (wishlist.includes(course._id)) {
        wishlist = wishlist.filter((id) => id !== course._id);
      } else {
        wishlist.push(course._id);
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsWishlisted(wishlist.includes(course._id));
      window.dispatchEvent(new Event("wishlistUpdate"));
    };

    return (
      <div
        onClick={() => navigate(`/course/${course._id}`)}
        className="group cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
      >
        <div className="relative overflow-hidden">
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 z-20 bg-white/90 p-2 rounded-full shadow-sm hover:scale-110 transition-transform"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500 text-sm" />
            ) : (
              <FaRegHeart className="text-gray-500 text-sm hover:text-red-400" />
            )}
          </button>

          {course.image ? (
            <img
              src={`${import.meta.env.VITE_UPLOADS_IMAGES_URL}/${course.image}`}
              alt={course.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 font-medium">
              No Preview Available
            </div>
          )}
          {course.price === 0 && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Free</span>
          )}
        </div>

        <div className="p-5 flex flex-col grow">
          <h3 className="font-bold text-gray-800 text-md leading-snug line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 mb-4 italic">By {course.teacher?.name || "Expert Instructor"}</p>
          
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xl font-black text-gray-900 font-mono">₹{course.price || 0}</span>
            {isEnrolled ? (
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/course/${course._id}`); }}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 hover:text-white transition-colors"
              >
                Go to Course
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddToCart(course._id); }}
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-1"
                >
                  <FaShoppingCart size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleBuy(course._id); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transition-all"
                >
                  Enroll
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      
    
      <div className="relative bg-linear-to-br from-green-50 via-white to-green-50 pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl text-gray-900 leading-[1.1] mb-6">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-400">
                Future Potential
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Join over 5,000+ students mastering real-world skills with expert-led courses.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
                className="group flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 hover:scale-105 transition-all shadow-lg shadow-green-100"
              >
                Start Learning 
                <Rocket size={20} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-green-400 rounded-3xl rotate-3 group-hover:rotate-1 transition-transform opacity-10"></div>
            <img
              src={heroImage}
              alt="Interactive Learning"
              className="relative z-10 w-full rounded-3xl shadow-2xl border-4 border-white transform group-hover:-translate-y-2 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

     
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        
       
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Right Now</h2>
              <p className="text-gray-500">The most popular courses this week</p>
            </div>
            <button 
              onClick={() => navigate('/courses')}
              className="flex items-center gap-1 text-green-600 font-bold hover:underline"
            >
              View All <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingCourses.length > 0 ? (
              trendingCourses.map((c) => <CourseCard key={c._id} {...c} />)
            ) : (
              <div className="col-span-full h-40 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
                Fetching trending courses...
              </div>
            )}
          </div>
        </section>

       
        <section className="bg-gray-50 rounded-3xl p-10 border border-gray-100 mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-green-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Excellence</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCourses.length > 0 ? (
              featuredCourses.map((c) => <CourseCard key={c._id} {...c} />)
            ) : (
              <p className="text-gray-400 col-span-full">No featured courses available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}