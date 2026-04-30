import { useState } from "react";
import MyCourses from "./MyCourses";
import Certificates from "./Certificates";
import NotificationsPanel from "../components/NotificationsPanel";

export default function StudentDashboard() {
  const [active, setActive] = useState("courses");

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-120px)] min-h-[calc(100vh-120px)]">

      
      <div className="w-full md:w-64 bg-gray-900 text-white p-4 md:p-5">
        <h2 className="text-xl font-bold mb-6">Student Panel</h2>

        <ul className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-2 md:space-y-3">

          
          <li>
            <button
              onClick={() => setActive("courses")}
              className={`w-full text-left px-3 py-2 rounded transition ${
                active === "courses" ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
            >
              📚 My Courses
            </button>
          </li>

        
          <li>
            <button
              onClick={() => setActive("certificates")}
              className={`w-full text-left px-3 py-2 rounded transition ${
                active === "certificates"
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
              }`}
            >
              🎓 Certificates
            </button>
          </li>

          <li>
            <button
              onClick={() => setActive("notifications")}
              className={`w-full text-left px-3 py-2 rounded transition ${
                active === "notifications"
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
              }`}
            >
              ✉️ Notifications
            </button>
          </li>

        </ul>
      </div>

  
      <div className="flex-1 p-4 md:p-6 bg-gray-100 overflow-y-auto">

        {active === "courses" && <MyCourses />}

        {active === "certificates" && <Certificates />}
        {active === "notifications" && <NotificationsPanel />}

      </div>
    </div>
  );
}