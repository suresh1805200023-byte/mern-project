import { useState } from "react";
import API from "../api";

export default function ReviewModal({ courseId, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    try {
      await API.post("/reviews", {
        courseId,
        rating,
        comment,
      });

      alert("Review submitted ✅");
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Leave a Rating</h2>

        
        <div className="flex gap-2 mb-3">
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl cursor-pointer ${
                star <= rating ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write comment..."
          className="border p-2 w-full mb-3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-400 px-3 py-1 text-white rounded">
            Cancel
          </button>

          <button onClick={submitReview} className="bg-blue-500 px-3 py-1 text-white rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}