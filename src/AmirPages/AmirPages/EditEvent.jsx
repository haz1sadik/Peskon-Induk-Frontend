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

  // --- NEW: Image State Handling ---
  const [posterFile, setPosterFile] = useState(null); // For new uploads
  const [previewUrl, setPreviewUrl] = useState(null); // For showing image (old or new)
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDate: "",
    startTime: "",
    description: "",
    is_featured: false,
  });

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

        // Date formatting helpers
        const dateObj = new Date(data.date_time);
        const dateStr = dateObj.toISOString().split('T')[0];
        const timeStr = dateObj.toTimeString().slice(0, 5);

        setFormData({
          title: data.title,
          location: data.location,
          startDate: dateStr,
          startTime: timeStr,
          description: data.description || "",
          is_featured: data.is_featured,
        });

        // SET THE EXISTING IMAGE PREVIEW
        if (data.poster_url) {
          setPreviewUrl(data.poster_url);
        }

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

  // --- DRAG & DROP HANDLERS ---
  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setPosterFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Show new image immediately
    } else {
      alert("Please select a valid image file.");
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // --- REMOVE IMAGE LOGIC ---
  const removeImage = () => {
    setPreviewUrl(null); // Clears the view
    setPosterFile(null); // Clears any new file pending upload
    // Note: If you want to delete the image on the backend immediately, 
    // you might need a separate API call here, or handle "null" in handleSubmit.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();

      // SWITCH TO FORM DATA for File Uploads
      const data = new FormData();
      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("date_time", dateTime);
      data.append("description", formData.description);
      data.append("is_featured", formData.is_featured);

      // Logic: 
      // 1. If there is a new file (posterFile), send it.
      // 2. If there is no file, but also NO previewUrl, it means user removed it.
      //    (Backend needs to handle logic for "if poster is empty, delete old one")
      
      if (posterFile) {
        data.append("poster", posterFile);
      } else if (!previewUrl) {
        // Optional: Send a flag to backend to indicate image removal if needed
        data.append("remove_poster", "true"); 
      }

      await api.put(`/api/admin/events/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
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

          {/* --- NEW: EVENT POSTER (With Remove & Preview) --- */}
          <div>
            <label className="block font-semibold mb-2 text-sm">Event Poster</label>
            
            {!previewUrl ? (
              // UPLOAD STATE
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
                  onChange={(e) => e.target.files[0] && handleFileChange(e.target.files[0])} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center text-center p-4 pointer-events-none">
                  {/* Icon */}
                  <svg className={`w-12 h-12 mb-3 ${isDragging ? "text-[#38ab70]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="font-medium text-gray-600">Click or drag new image to replace</p>
                </div>
              </div>
            ) : (
              // PREVIEW STATE (Shows Old or New Image)
              <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-300 group">
                <img 
                  src={previewUrl} 
                  alt="Event Poster" 
                  className="w-full h-full object-cover"
                />
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button 
                    type="button"
                    onClick={removeImage}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-red-50 transition"
                  >
                    Remove Poster
                  </button>
                  <p className="text-white text-sm absolute bottom-4">Drop new file to replace</p>
                </div>
                 {/* Invisible input to allow drag-drop replace even while preview is showing */}
                 <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => e.target.files[0] && handleFileChange(e.target.files[0])} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Click to replace image"
                />
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