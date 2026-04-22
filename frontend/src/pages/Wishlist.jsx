import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaHeartBroken } from "react-icons/fa";

export default function Wishlist() {
  const [courses, setCourses] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const storedWishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistIds(storedWishlist);

      const [courseRes, enrollRes] = await Promise.all([
        API.get("/courses"),
        API.get("/enrollments/my-courses"),
      ]);

      const filtered = courseRes.data.filter((c) =>
        storedWishlist.includes(c._id)
      );

      setCourses(filtered);
      setEnrolledIds(enrollRes.data.map((e) => e.course._id));
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (courseId) => {
    const updatedIds = wishlistIds.filter((id) => id !== courseId);
    localStorage.setItem("wishlist", JSON.stringify(updatedIds));
    setWishlistIds(updatedIds);
    setCourses(courses.filter((c) => c._id !== courseId));

    window.dispatchEvent(new Event("wishlistUpdate"));
  };

  const handleBuy = async (courseId) => {
    try {
      localStorage.setItem("courseId", courseId);
      const res = await API.post("/payment/checkout", { courseId });
      window.location.href = res.data.url;
    } catch (err) {
      alert("Payment failed");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Loading Wishlist...
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        
        
        <h1 className="text-3xl font-bold text-gray-800 mb-10 flex items-center gap-3">
          My Wishlist <FaHeart className="text-red-500" />
        </h1>

        {courses.length === 0 ? (
         
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-md border border-dashed border-gray-300">
            <FaHeartBroken className="text-gray-300 text-6xl mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              Your wishlist is empty
            </p>

            <Link
              to="/"
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
        
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => navigate(`/course/${course._id}`)}
                className="group relative cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
              >
             
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(course._id);
                  }}
                  className="absolute top-2 right-2 z-10 bg-white/90 p-2 rounded-full shadow hover:scale-110 transition"
                >
                  <FaHeart className="text-red-500 text-sm" />
                </div>

              
                <div className="overflow-hidden">
                  <img
                    src={`http://localhost:5000/uploads/images/${course.image}`}
                    alt={course.title}
                    className="w-full h-36 object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

              
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {course.teacher?.name}
                  </p>

                  <p className="text-sm font-bold mt-2 text-gray-900">
                    ₹{course.price}
                  </p>

                 
                  {enrolledIds.includes(course._id) ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/learn/${course._id}`);
                      }}
                      className="mt-3 w-full bg-green-600 text-white text-xs py-1.5 rounded-md hover:bg-green-700 transition"
                    >
                      ▶ Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuy(course._id);
                      }}
                      className="mt-3 w-full bg-purple-600 text-white text-xs py-1.5 rounded-md hover:bg-purple-700 transition"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}