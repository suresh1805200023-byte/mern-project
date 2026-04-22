import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api";
import CourseCard from "./CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await API.get("/courses");
      setCourses(res.data);
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const courseCategoryId =
        typeof course.category === "string" ? course.category : course.category?._id;

      const matchesCategory = selectedCategory
        ? courseCategoryId === selectedCategory
        : true;

      const normalizedTitle = (course.title || "").toLowerCase();
      const normalizedTeacher = (course.teacher?.name || "").toLowerCase();
      const normalizedCategory = (course.category?.name || "").toLowerCase();

      const matchesSearch = searchQuery
        ? normalizedTitle.includes(searchQuery) ||
          normalizedTeacher.includes(searchQuery) ||
          normalizedCategory.includes(searchQuery)
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  const handleCategoryFilter = (categoryId) => {
    const next = new URLSearchParams(searchParams);
    if (categoryId) next.set("category", categoryId);
    else next.delete("category");
    setSearchParams(next);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Explore Courses</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Browse by category
          </p>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleCategoryFilter("")}
              className={`px-3.5 py-1.5 rounded-full text-sm border transition ${
                !selectedCategory
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-green-400 hover:text-green-700"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryFilter(cat._id)}
                className={`px-3.5 py-1.5 rounded-full text-sm border transition ${
                  selectedCategory === cat._id
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-green-400 hover:text-green-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] gap-5 place-items-center">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-800">No courses found</h2>
            <p className="text-slate-500 mt-1">
              Try another category or clear filters to explore more courses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}