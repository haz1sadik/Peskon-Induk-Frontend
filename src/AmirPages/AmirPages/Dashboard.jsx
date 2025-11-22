import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // Import the setup we made above

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // FETCH DATA
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Using the public endpoint to list all events as per your doc (1.1)
        const res = await api.get("/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // DELETE EVENT (3.3)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/api/admin/events/${id}`);
      // Update UI immediately
      setEvents(events.filter((event) => event.id !== id));
      alert("Event deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login"); // Adjust to your actual login route
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 font-inter text-gray-800 py-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage PESKON events.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-100">
              Logout
            </button>
            <Link to="/admin/create" className="bg-[#38ab70] hover:bg-[#2f915f] text-white px-5 py-3 rounded-xl font-medium shadow-sm flex items-center gap-2">
              + Create Event
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Date & Time</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold text-center">Featured</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">{event.title}</td>
                      <td className="p-4 text-gray-600 text-sm">
                        {new Date(event.date_time).toLocaleDateString()} <br/>
                        <span className="text-xs text-gray-400">
                          {new Date(event.date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 text-sm">{event.location}</td>
                      <td className="p-4 text-center">
                        {event.is_featured ? (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Yes</span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link to={`/admin/edit/${event.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:underline text-sm font-medium">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}