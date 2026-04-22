import { useState } from "react";
import API from "../api";

export default function Settings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const res = await API.put("/users/change-password", {
        oldPassword,
        newPassword,
      });

      setMessage(res.data.message);
      setOldPassword("");
      setNewPassword("");

    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        🔐 Change Password
      </h2>

      <form onSubmit={handleChangePassword}>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 border mb-3 rounded"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border mb-3 rounded"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update Password
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center text-green-600">
          {message}
        </p>
      )}
    </div>
  );
}