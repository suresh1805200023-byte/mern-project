import { useState } from "react";
import API from "../api";

export default function ProfileSection({ profile, fetchProfile }) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    about: profile?.about || "",
  });

  const [image, setImage] = useState(null);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("about", form.about);

      if (image) {
        formData.append("profilePic", image);
      }

      await API.put("/instructor/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated ✅");
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">👤 Edit Profile</h2>

      
      {profile?.profilePic && (
        <img
          src={`http://localhost:5000/uploads/${profile.profilePic}`}
          className="w-24 h-24 rounded-full mb-3 object-cover"
        />
      )}

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-3"
      />

      <input
        type="text"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        placeholder="Name"
        className="w-full border p-2 mb-3"
      />

      <textarea
        value={form.about}
        onChange={(e) =>
          setForm({ ...form, about: e.target.value })
        }
        placeholder="About Me"
        className="w-full border p-2 mb-3"
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Profile
      </button>
    </div>
  );
}