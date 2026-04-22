import { useState, useEffect } from "react";
import API from "../api";
import { 
  QuestionMarkCircleIcon, 
  LifebuoyIcon, 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";

export default function Help() {
  const [form, setForm] = useState({ category: "", message: "" });
  const [tickets, setTickets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyTickets = async () => {
    try {
      const res = await API.get("/support/my");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const submitTicket = async () => {
    if (!form.category || !form.message) return;
    
    setIsSubmitting(true);
    try {
      await API.post("/support", form);
      setForm({ category: "", message: "" });
      fetchMyTickets();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      
    
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <LifebuoyIcon className="w-10 h-10 text-emerald-500" />
          Support Center
        </h1>
        <p className="text-slate-500 font-medium mt-2">Find quick answers or start a conversation with our team.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
      
        <div className="lg:col-span-2 space-y-8">
          
         
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { q: "Payment Failed", a: "Check card balance or try UPI.", icon: ExclamationCircleIcon },
              { q: "Course Locked", a: "Try relogging to refresh cache.", icon: CheckCircleIcon },
              { q: "Video Issues", a: "Check speed or clear browser data.", icon: QuestionMarkCircleIcon },
            ].map((faq, i) => (
              <div key={i} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <faq.icon className="w-6 h-6 text-emerald-500 mb-3" />
                <h3 className="font-black text-slate-800 text-sm mb-1">{faq.q}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

         
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-slate-400" />
              Open a Support Ticket
            </h2>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Issue Category</label>
                <select
                  className="bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select a category...</option>
                  <option>Billing & Payments</option>
                  <option>Technical Issue</option>
                  <option>Course Curriculum</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Message</label>
                <textarea
                  placeholder="Tell us more about what's happening..."
                  rows="5"
                  className="bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none ring-2 ring-transparent focus:ring-emerald-500 transition-all resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button
                onClick={submitTicket}
                disabled={isSubmitting || !form.category || !form.message}
                className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-lg shadow-slate-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-slate-900"
              >
                {isSubmitting ? "SENDING..." : (
                  <>
                    <PaperAirplaneIcon className="w-4 h-4" />
                    SUBMIT REQUEST
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

       
        <div className="lg:col-span-1">
          <div className="sticky top-10">
            <h2 className="text-xl font-black text-slate-800 mb-6">Recent Requests</h2>
            
            {tickets.length === 0 ? (
              <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                <ClockIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-sm leading-tight">No active requests found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((t) => (
                  <div key={t._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(t.status)}`}>
                        {t.status || 'Received'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">#{t._id.slice(-5)}</span>
                    </div>
                    
                    <p className="font-black text-slate-800 text-sm mb-1">{t.category}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{t.message}</p>

                    {t.reply && (
                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase">Support Team</span>
                        </div>
                        <p className="text-xs text-slate-600 italic bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                          "{t.reply}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}