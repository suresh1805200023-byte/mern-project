import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart, FaPlay } from "react-icons/fa";

export default function CourseCard({ course }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkEnrollment();
    checkWishlist();
    
    const handleSync = () => checkWishlist();
    window.addEventListener("wishlistUpdate", handleSync);
    return () => window.removeEventListener("wishlistUpdate", handleSync);
  }, [course._id]);

  const checkEnrollment = async () => {
    try {
      const res = await API.get("/enrollments/my-courses");
      const enrolled = res.data.some((item) => item.course._id === course._id);
      setIsEnrolled(enrolled);
    } catch (err) {
      console.error("Enrollment check failed", err);
    }
  };

  const checkWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(wishlist.includes(course._id));
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    if (isWishlisted) {
      wishlist = wishlist.filter((id) => id !== course._id);
    } else {
      wishlist.push(course._id);
    }
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
    window.dispatchEvent(new Event("wishlistUpdate"));
  };

  const handleBuy = async (e) => {
    e.stopPropagation();
    try {
      localStorage.setItem("courseId", course._id);
      const res = await API.post("/payment/checkout", { courseId: course._id });
      window.location.href = res.data.url;
    } catch (err) {
      alert("Payment failed. Please try again.");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.includes(course._id)) {
      cart.push(course._id);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdate"));
    }
  };

  return (
    <div
      onClick={() => navigate(`/course/${course._id}`)}
      className="group relative flex flex-col bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 w-[170px] cursor-pointer"
    >
     
      <button 
        onClick={toggleWishlist}
        className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:scale-110 active:scale-90 transition-all flex items-center justify-center border border-gray-50"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500 text-[10px]" />
        ) : (
          <FaRegHeart className="text-gray-400 text-[10px] hover:text-red-400" />
        )}
      </button>

      
      <div className="relative overflow-hidden rounded-lg h-24 bg-gray-50">
        <img
          src={`http://localhost:5000/uploads/images/${course.image}`}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

     
      <div className="mt-3 grow">
        <h3 className="text-[11px] font-bold text-gray-800 leading-[1.3] line-clamp-2 h-7 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-[9px] text-gray-500 truncate mt-1 font-medium">
          {course.teacher?.name || "Expert Instructor"}
        </p>

      
        <div className="mt-2 flex items-baseline gap-0.5">
          <span className="text-[10px] font-sans text-gray-600 font-medium">₹</span>
          <span className="text-[14px] font-mono font-bold text-gray-900 tracking-tight">
            {course.price.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="mt-3">
        {isEnrolled ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/learn/${course._id}`);
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <FaPlay className="text-[8px]" /> Learn
          </button>
        ) : (
          <div className="flex gap-1.5">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[9px] font-bold py-1.5 rounded-lg border border-gray-200 transition-all flex items-center justify-center gap-1"
            >
              <FaShoppingCart className="text-[8px]" />
            </button>
            <button
              onClick={handleBuy}
              className="flex-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 rounded-lg shadow-md shadow-indigo-100 transition-all active:scale-95"
            >
              Buy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}