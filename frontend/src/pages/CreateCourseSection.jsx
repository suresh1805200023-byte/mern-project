import { useState, useEffect } from "react";
import API from "../api";

function CreateCourseSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    whatYouWillLearn: "",
    courseIncludes: "",
    requirements: "",
    category: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const createCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("image", form.image);
      data.append("category", form.category);

      // Processing comma-separated strings into JSON arrays
      data.append("whatYouWillLearn", JSON.stringify(form.whatYouWillLearn.split(",").map(s => s.trim())));
      data.append("courseIncludes", JSON.stringify(form.courseIncludes.split(",").map(s => s.trim())));
      data.append("requirements", JSON.stringify(form.requirements.split(",").map(s => s.trim())));

      await API.post("/courses/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Course created successfully! ✅");
      // Optional: Reset form or redirect
    } catch (err) {
      console.error(err);
      alert("Error creating course ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-800">Launch New Course</h2>
        <p className="text-slate-500 font-medium mt-1">Fill in the professional details to list your course.</p>
      </div>

      <form onSubmit={createCourse} className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Course Title</label>
            <input
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
              placeholder="e.g. Java Masterclass: Zero to Hero"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
            <select
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer appearance-none text-slate-700"
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price (₹)</label>
            <input
              type="number"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
              placeholder="999"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Thumbnail Image</label>
            <div className="relative group">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                required
              />
              <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center text-slate-400 group-hover:border-emerald-400 group-hover:bg-emerald-50 transition-all">
                {form.image ? <span className="text-emerald-600 font-bold">{form.image.name}</span> : "Upload JPG/PNG Thumbnail"}
              </div>
            </div>
          </div>
        </div>

        
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Detailed Description</label>
            <textarea
              rows="4"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
              placeholder="What makes this course unique? Deep dive into the curriculum..."
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Learning Outcomes</label>
              <textarea
                rows="3"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="OOP, Spring Boot, MySQL (comma separated)"
                onChange={(e) => setForm({ ...form, whatYouWillLearn: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Course Includes</label>
              <textarea
                rows="3"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="10 Hours Video, Certificate (comma separated)"
                onChange={(e) => setForm({ ...form, courseIncludes: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Requirements</label>
              <textarea
                rows="3"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Basic Java, PC with 8GB RAM (comma separated)"
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              />
            </div>
          </div>
        </div>

        
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-12 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "PROCESSING..." : "CREATE COURSE"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCourseSection;