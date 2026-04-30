import { useEffect, useState } from "react";
import API from "../api";
import NotificationsPanel from "../components/NotificationsPanel";
import { 
  Star, 
  Trophy, 
  Users, 
  BookOpen, 
  Crown, 
  Trash2, 
  ExternalLink, 
  X 
} from "lucide-react";

export default function AdminDashboard() {
  const [active, setActive] = useState("analytics");

  // Data States
  const [apps, setApps] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [sales, setSales] = useState(0);
  const [approvedTeachers, setApprovedTeachers] = useState(0);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [users, setUsers] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  
  // Leaderboard States
  const [topTeachers, setTopTeachers] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  // UI States
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [ticketDrafts, setTicketDrafts] = useState({});

  //Fetch Functions  Defined before useEffect

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      const data = Array.isArray(res.data) ? res.data : res.data?.users || [];
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await API.get("/application");
      const data = Array.isArray(res.data) ? res.data : [];
      setApps(data);
      setApprovedTeachers(data.filter((app) => app.status === "approved").length);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await API.get("/admin/revenue");
      setRevenue(res.data?.totalRevenue || 0);
      setSales(res.data?.totalSales || 0);
    } catch (err) {
      console.error("Error fetching revenue:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchLeaderboards = async () => {
    try {
      const teacherRes = await API.get("/admin/top-teachers");
      const courseRes = await API.get("/admin/top-courses");
      setTopTeachers(teacherRes.data.teachers?.slice(0, 5) || []);
      setTopCourses(courseRes.data.courses?.slice(0, 5) || []);
    } catch (err) {
      console.error("Error fetching leaderboards:", err);
    }
  };

  const fetchSupportTickets = async () => {
    try {
      const res = await API.get("/support");
      setSupportTickets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching support tickets:", err);
    }
  };

  //  Actions

  const toggleBan = async (user) => {
    try {
      const res = await API.put(`/admin/ban/${user._id}`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isBanned: res.data.user.isBanned } : u))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const updateAppStatus = async (id, status) => {
    try {
      await API.put(`/application/${id}`, { status, message: statusMessage });
      setSelectedApp(null);
      setStatusMessage("");
      fetchApplications();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await API.post("/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSupportDraftChange = (ticketId, key, value) => {
    setTicketDrafts((prev) => ({
      ...prev,
      [ticketId]: {
        status: prev[ticketId]?.status || "open",
        reply: prev[ticketId]?.reply || "",
        [key]: value,
      },
    }));
  };

  const updateSupportTicket = async (ticketId) => {
    const draft = ticketDrafts[ticketId] || {};
    try {
      await API.put(`/support/${ticketId}`, {
        status: draft.status || "open",
        reply: draft.reply || "",
      });
      await fetchSupportTickets();
    } catch (err) {
      alert("Failed to update support ticket");
    }
  };


  useEffect(() => {
    fetchApplications();
    fetchRevenue();
    fetchCategories();
    fetchUsers();
    fetchLeaderboards();
    fetchSupportTickets();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans antialiased">
      
      {/* SIDEBAR */}
      <div className="w-full lg:w-72 bg-slate-900 text-white p-4 sm:p-6 shadow-2xl z-20">
        <div className="mb-12 px-4">
          <h2 className="text-2xl font-black tracking-tighter text-emerald-400">DASHBOARD</h2>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Admin Management</p>
        </div>

        <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
          {["analytics", "applications", "categories", "users", "support", "notifications"].map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`w-full text-left px-5 py-3 rounded-2xl capitalize font-bold transition-all ${
                active === item 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

   
      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        
       
        {active === "analytics" && (
          <div className="animate-in fade-in duration-500 space-y-12">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-6 sm:mb-8">Platform Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-slate-400 font-bold text-xs uppercase mb-1">Net Revenue</p>
                  <p className="text-4xl font-black text-emerald-600">₹{revenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-slate-400 font-bold text-xs uppercase mb-1">Total Sales</p>
                  <p className="text-4xl font-black text-slate-800">₹{sales.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-slate-400 font-bold text-xs uppercase mb-1">Verified Teachers</p>
                  <p className="text-4xl font-black text-blue-600">{approvedTeachers}</p>
                </div>
              </div>
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            
              <div className="bg-white rounded-[2.5rem] p-5 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                    <Trophy size={22} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Top 5 Teachers</h2>
                </div>
                <div className="space-y-4">
                  {topTeachers.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-xs ${idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{t.totalSales} Sales</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                        <Star size={12} fill="#fbbf24" className="text-amber-400" />
                        <span className="text-xs font-black text-slate-700">{t.avgRating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

          
              <div className="bg-white rounded-[2.5rem] p-5 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                    <BookOpen size={22} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Top 5 Courses</h2>
                </div>
                <div className="space-y-4">
                  {topCourses.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <Crown size={18} className={idx === 0 ? "text-amber-400" : "text-slate-300"} />
                        <p className="font-bold text-slate-800 text-sm line-clamp-1">{c.title}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-black text-emerald-600 uppercase">Enrollments</p>
                        <p className="font-black text-emerald-700 text-sm">{c.totalEnrollments}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

   
        {active === "users" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">User Details</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                        user.isBanned ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                      }`}>
                        {user.isBanned ? "BANNED" : "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => toggleBan(user)}
                        className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                          user.isBanned 
                          ? "bg-slate-800 text-white" 
                          : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100"
                        }`}
                      >
                        {user.isBanned ? "RESTORE ACCESS" : "BAN USER"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

  
        {active === "applications" && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-3xl font-black text-slate-800 mb-8">Teacher Applications</h1>
            <div className="grid gap-4">
              {apps.map((app) => (
                <div key={app._id} className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:shadow-md">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{app.user?.name}</h3>
                    <p className="text-slate-400 text-sm">{app.user?.email}</p>
                    <div className="mt-2 flex gap-2">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                        app.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedApp(app)}
                    className="bg-slate-900 text-white px-6 py-2 rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all"
                  >
                    View Full Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

     
        {active === "categories" && (
          <div className="max-w-2xl">
            <h1 className="text-3xl font-black text-slate-800 mb-8">Manage Categories</h1>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ex: Web Development"
                className="flex-1 px-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <button onClick={createCategory} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black">ADD</button>
            </div>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center border border-slate-100 gap-3">
                  <span className="font-bold text-slate-700">{cat.name}</span>
                  <button onClick={() => deleteCategory(cat._id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "support" && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-black text-slate-800 mb-8">Help Center Tickets</h1>

            {supportTickets.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center text-slate-500">
                No support messages yet.
              </div>
            ) : (
              <div className="space-y-4">
                {supportTickets.map((ticket) => {
                  const currentStatus = ticketDrafts[ticket._id]?.status || ticket.status || "open";
                  const currentReply = ticketDrafts[ticket._id]?.reply ?? ticket.reply ?? "";

                  return (
                    <div key={ticket._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="font-bold text-slate-800">{ticket.user?.name || "Unknown user"}</p>
                          <p className="text-xs text-slate-400">{ticket.user?.email || "No email"}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                              {ticket.user?.role || "user"}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600">
                              {ticket.category || "General"}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400">
                          {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4">
                        <p className="text-sm text-slate-700 whitespace-pre-line">{ticket.message}</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                            Status
                          </label>
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              handleSupportDraftChange(ticket._id, "status", e.target.value)
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="open">Open</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                            Reply
                          </label>
                          <textarea
                            rows="2"
                            value={currentReply}
                            onChange={(e) =>
                              handleSupportDraftChange(ticket._id, "reply", e.target.value)
                            }
                            placeholder="Write a response for the user/teacher..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => updateSupportTicket(ticket._id)}
                          className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-black hover:bg-emerald-700 transition-colors"
                        >
                          Save Ticket Update
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {active === "notifications" && <NotificationsPanel />}

       
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
            <div className="relative w-full max-w-xl bg-white h-full shadow-2xl p-5 sm:p-10 overflow-y-auto animate-in slide-in-from-right duration-300">
              <button onClick={() => setSelectedApp(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900">
                <X size={24} />
              </button>
              
              <div className="mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Review Application</h2>
                <p className="text-slate-400 font-medium">Applied on {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="space-y-10">
                <div className="bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Resume / CV</p>
                    <p className="text-sm font-bold truncate pr-4">{selectedApp.user?.name}_Resume.pdf</p>
                  </div>
                  <a href={selectedApp.resume} target="_blank" rel="noreferrer" className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black">
                    OPEN PDF
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Website', url: selectedApp.website },
                    { label: 'LinkedIn', url: selectedApp.linkedin },
                    { label: 'GitHub', url: selectedApp.github }
                  ].map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center hover:bg-slate-100 transition-all">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{link.label}</p>
                      <span className="text-xs font-bold text-slate-800 underline flex items-center justify-center gap-1">
                        Visit <ExternalLink size={10} />
                      </span>
                    </a>
                  ))}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Experience</label>
                    <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 border border-slate-100 text-sm leading-relaxed">
                      {selectedApp.experience || "No details provided."}
                    </div>
                  </div>
                </div>

                {selectedApp.status === "pending" && (
                  <div className="pt-10 border-t border-slate-100">
                    <textarea 
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                      placeholder="Add feedback (optional)..."
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 mb-6 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      rows="3"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => updateAppStatus(selectedApp._id, "approved")} className="bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all">APPROVE</button>
                      <button onClick={() => updateAppStatus(selectedApp._id, "rejected")} className="bg-white text-red-600 border border-red-100 font-black py-4 rounded-2xl hover:bg-red-50 transition-all">REJECT</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}