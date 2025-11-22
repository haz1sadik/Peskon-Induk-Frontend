import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Store the actual file object for upload
  const [posterFile, setPosterFile] = useState(null);
  // Store the preview URL for display
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDate: "",
    startTime: "",
    description: "",
    is_featured: false,
    // poster_url is removed from here as we are handling a File object now
  });

  // --- QUILL CONFIGURATION ---
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
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

  // --- IMAGE UPLOAD HANDLERS ---

  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setPosterFile(file);
      // Create a local preview URL
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
    }
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setPosterFile(null);
    setPreviewUrl(null);
  };

  // Clean up memory when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();

      // IMPORTANT: Since we are uploading a file, we usually use FormData 
      // instead of a JSON object.
      const data = new FormData();
      data.append("title", formData.title);
      data.append("date_time", dateTime);
      data.append("location", formData.location);
      data.append("description", formData.description);
      data.append("is_featured", formData.is_featured);
      
      // Append the file if it exists
      if (posterFile) {
        data.append("poster", posterFile); 
      }

      // Note: Ensure your header content-type is set correctly in api.js 
      // or let axios/fetch handle it automatically when detecting FormData.
      await api.post("/api/admin/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
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

          {/* --- NEW: EVENT POSTER SECTION --- */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Event Poster</label>
            
            {!previewUrl ? (
              // Upload State
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer bg-gray-50
                  ${isDragging ? "border-[#38ab70] bg-green-50" : "border-gray-300 hover:bg-gray-100"}
                `}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={onFileSelect} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center text-center p-4 pointer-events-none">
                  <svg className={`w-12 h-12 mb-3 ${isDragging ? "text-[#38ab70]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="font-medium text-gray-600">Click or drag image here to upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or JPEG (Max 5MB)</p>
                </div>
              </div>
            ) : (
              // Preview State
              <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-300 group">
                <img 
                  src={previewUrl} 
                  alt="Poster Preview" 
                  className="w-full h-full object-cover"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="bg-white text-red-500 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-red-50 transition"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
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