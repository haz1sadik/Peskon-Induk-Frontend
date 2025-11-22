import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill"; 
import "react-quill/dist/quill.snow.css"; 
import api from "../api";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDate: "",
    startTime: "",
    description: "",
    poster_url: "",
    is_featured: false,
  });

  // --- QUILL CONFIGURATION (STRICTLY NO IMAGES) ---
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"], // <--- Only Links allowed. NO ["image"] here!
      ["clean"],
    ],
  };

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
    setIsLoading(true);

    try {
      const dateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();

      const payload = {
        title: formData.title,
        date_time: dateTime,
        location: formData.location,
        description: formData.description, // Sends the HTML string
        poster_url: formData.poster_url,
        is_featured: formData.is_featured,
      };

      await api.post("/api/admin/events", payload);
      
      alert("Event created successfully!");
      navigate("/admin/dashboard");

    } catch (err) {
      console.error("Create Error:", err);
      alert("Failed to create event.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-10 px-4 font-inter text-gray-800 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Create New Event</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Event Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38ab70]"
              placeholder="e.g. Majlis Pelancaran PESKON"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38ab70]"
              placeholder="e.g. Dewan Besar UPM"
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
              placeholder="https://cdn.peskonupm.com/img123.jpg"
            />
          </div>

          {/* RICH TEXT DESCRIPTION (Cleaned Toolbar) */}
          <div className="flex flex-col">
            <label className="block font-semibold mb-2 text-sm">Description</label>
            <div className="bg-white rounded-xl overflow-hidden">
              <ReactQuill 
                theme="snow" 
                value={formData.description} 
                onChange={handleDescriptionChange} 
                modules={modules} // <--- Using the 'No Image' config
                className="h-48 mb-12 rounded-xl" 
                placeholder="Enter event details..."
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
          <button type="submit" disabled={isLoading}
            className="w-full bg-[#38ab70] hover:bg-[#2f915f] text-white font-bold rounded-xl px-6 py-4 transition shadow-md disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Submit Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

//byk guna gemini gak a sebab kalut sorry wan lebiu (tapi aku buat gak a cuma xclean so suh dia cleanup)