import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";
import AboutUs from "./pages/AboutUs"; // ✅ FIXED

import ContactUs from "./pages/ContactUs";
import Footer from "./components/Footer";
import CourseDetails from "./pages/CourseDetails";
import Courses from "./pages/Courses";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BecomeTeacher from "./pages/BecomeTeacher";
import TeacherDashboard from "./pages/TeacherDashboard";
import CourseLessons from "./pages/CourseLesson";
import Success from "./pages/Success";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Help from "./pages/Help";
import Cart from "./pages/Cart";

import ProtectedRoute from "./routes/ProtectedRoute";
import Wishlist from "./pages/Wishlist";

function App() {
  console.log("ENV:", import.meta.env.VITE_API_BASE_URL); // ✅ debug

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/apply-teacher" element={<BecomeTeacher />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/learn/:courseId" element={<CourseLessons />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/success" element={<Success />} />
            <Route path="/help" element={<Help />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;