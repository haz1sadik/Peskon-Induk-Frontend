import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill"; 
import "react-quill/dist/quill.snow.css";
import api from "../api";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDate: "",
    startTime: "",
    description: "",
    poster_url: "",
    is_featured: false,
  });

  // --- QUILL CONFIGURATION (SAME AS CREATE) ---
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"], 
      ["clean"],
    ],
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        const data = res.data;

        const dateObj = new Date(data.date_time);
        const dateStr = dateObj.toISOString().split('T')[0];
        const timeStr = dateObj.toTimeString().slice(0, 5);

        setFormData({
          title: data.title,
          location: data.location,
          startDate: dateStr,
          startTime: timeStr,
          description: data.description || "", // Load HTML directly into Quill
          poster_url: data.poster_url,
          is_featured: data.is_featured,
        });
      } catch (err) {
        console.error(err);
        alert("Could not load event.");
        navigate("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();

      const payload = {
        title: formData.title,
        location: formData.location,
        date_time: dateTime,
        description: formData.description, // Send HTML from Quill
        poster_url: formData.poster_url,
        is_featured: formData.is_featured,
      };

      await api.put(`/api/admin/events/${id}`, payload);
      
      alert("Event updated successfully");
      navigate("/admin/dashboard");

    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="w-full flex justify-center py-10 px-4 font-inter text-gray-800 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
            <button onClick={() => navigate("/admin/dashboard")} className="text-gray-500 hover:text-gray-800">Cancel</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Event Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38ab70]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38ab70]"
            />
          </div>

           {/* Date & Time */}
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-sm">Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38ab70]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-sm">Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38ab70]"
              />
            </div>
          </div>

          {/* Poster URL */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Poster Image URL</label>
            <input type="url" name="poster_url" value={formData.poster_url} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38ab70]"
            />
          </div>

          {/* RICH TEXT DESCRIPTION */}
          <div className="flex flex-col">
            <label className="block font-semibold mb-2 text-sm">Description</label>
            <div className="bg-white rounded-xl overflow-hidden">
              <ReactQuill 
                theme="snow" 
                value={formData.description} 
                onChange={handleDescriptionChange} 
                modules={modules} 
                className="h-48 mb-12 rounded-xl"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
            <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange}
              className="h-5 w-5 text-[#38ab70] focus:ring-[#38ab70] rounded"
            />
            <label className="font-medium text-gray-800 text-sm">Mark as Featured Event</label>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-[#38ab70] hover:bg-[#2f915f] text-white font-bold rounded-xl px-6 py-4 transition shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}