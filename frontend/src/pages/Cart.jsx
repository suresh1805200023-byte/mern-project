import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import API from "../api";

export default function Cart() {
  const [cartIds, setCartIds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartIds(storedCart);

      const [courseRes, enrollRes] = await Promise.all([
        API.get("/courses"),
        API.get("/enrollments/my-courses"),
      ]);

      const filteredCourses = courseRes.data.filter((c) => storedCart.includes(c._id));
      setCourses(filteredCourses);
      setEnrolledIds(enrollRes.data.map((e) => e.course._id));
    } catch (err) {
      console.error("Cart fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = useMemo(
    () => courses.reduce((sum, course) => sum + Number(course.price || 0), 0),
    [courses]
  );
  const payableCourses = useMemo(
    () => courses.filter((course) => !enrolledIds.includes(course._id)),
    [courses, enrolledIds]
  );
  const payableTotal = useMemo(
    () => payableCourses.reduce((sum, course) => sum + Number(course.price || 0), 0),
    [payableCourses]
  );

  const removeFromCart = (courseId) => {
    const updated = cartIds.filter((id) => id !== courseId);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartIds(updated);
    setCourses(courses.filter((course) => course._id !== courseId));
    window.dispatchEvent(new Event("cartUpdate"));
  };

  const handleBuy = async (courseId) => {
    try {
      const res = await API.post("/payment/checkout", { courseId });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again.");
    }
  };

  const handleCheckoutAll = async () => {
    if (!payableCourses.length) return;

    try {
      const res = await API.post("/payment/checkout", {
        courseIds: payableCourses.map((course) => course._id),
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Bulk checkout failed:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading cart...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          My Cart <FaShoppingCart className="text-emerald-600" />
        </h1>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <FaShoppingCart className="text-gray-300 text-5xl mb-4" />
            <p className="text-gray-500 font-medium">Your cart is empty</p>
            <Link to="/" className="mt-4 text-green-600 font-bold hover:underline">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {courses.map((course) => {
                const isEnrolled = enrolledIds.includes(course._id);
                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4"
                  >
                    <img
                       src={`${import.meta.env.VITE_UPLOADS_IMAGES_URL}/${course.image}`}
                      alt={course.title}
                      className="w-32 h-20 object-cover rounded-lg cursor-pointer"
                      onClick={() => navigate(`/course/${course._id}`)}
                    />

                    <div className="flex-1">
                      <h3
                        className="font-semibold text-gray-800 cursor-pointer hover:text-emerald-600"
                        onClick={() => navigate(`/course/${course._id}`)}
                      >
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500">By {course.teacher?.name || "Instructor"}</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">Rs. {course.price}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(course._id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        title="Remove from cart"
                      >
                        <FaTrash />
                      </button>

                      {isEnrolled ? (
                        <button
                          onClick={() => navigate(`/learn/${course._id}`)}
                          className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700"
                        >
                          Learn
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(course._id)}
                          className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded hover:bg-indigo-700"
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Courses</span>
                <span>{courses.length}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Total</span>
                <span className="font-bold text-gray-900">Rs. {totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Payable</span>
                <span className="font-bold text-gray-900">Rs. {payableTotal}</span>
              </div>
              <button
                onClick={handleCheckoutAll}
                disabled={!payableCourses.length}
                className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Checkout {payableCourses.length > 1 ? `(${payableCourses.length} Courses)` : "(1 Course)"}
              </button>
              <p className="text-xs text-gray-500 mt-3">
                Pay for all non-enrolled courses in one checkout.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
