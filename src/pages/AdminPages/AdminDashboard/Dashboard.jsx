import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "axios"; // Import the setup we made above
import PrimaryButton from "../../../components/ui/button/PrimaryButton";

// Parse custom format: 2024-07-01T10:00:00MYT (Malaysia Time UTC+8)
function parseMYT(str) {
  if (!str) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})MYT$/.exec(str);
  if (!match) {
    const fallback = new Date(str);
    return isNaN(fallback) ? null : fallback;
  }
  const [_, y, m, d, hh, mm, ss] = match;
  // Convert provided MYT time (UTC+8) to UTC for Date object storage
  return new Date(Date.UTC(+y, +m - 1, +d, +hh - 8, +mm, +ss));
}

function getEventDateParts(event) {
  const start = parseMYT(event.date_time);
  const end = event.end_date_time ? parseMYT(event.end_date_time) : null;
  if (!start) return { hasEnd: false, startDate: '-', startTime: '-', endDate: null, endTime: null, sameDay: true };

  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: 'short', day: '2-digit'
  });
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', hour12: false
  });

  const startDate = dateFormatter.format(start);
  const startTime = timeFormatter.format(start);

  if (!end) return { hasEnd: false, startDate, startTime, endDate: null, endTime: null, sameDay: true };

  const endDate = dateFormatter.format(end);
  const endTime = timeFormatter.format(end);
  return { hasEnd: true, startDate, startTime, endDate, endTime, sameDay: startDate === endDate };
}

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // AUTH CHECK: Redirect if no access token present
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // FETCH DATA
  useEffect(() => {
    const fetchEvents = async () => {
      // If unauthenticated, skip fetching
      if (!localStorage.getItem("accessToken")) return;
      try {
        const res = await api.get(`${import.meta.env.VITE_API_BASEURL}/api/events`)
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events", err);
        alert("Failed to fetch events.");
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
      await api.delete(
        `${import.meta.env.VITE_API_BASEURL}/api/admin/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );
      // Update UI immediately
      setEvents(events.filter((event) => event.id !== id));
      alert("Event deleted successfully");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        // Forbidden, redirect to login
        navigate('/admin/login');
      }
      alert("Failed to delete event.");
    }
  };

  const buttonText = (
    <div className="flex items-center justify-center gap-2">
      <svg
        className="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
        />
      </svg>
      <span>Create Event</span>
    </div>
  )
  return (
    <div className="w-full min-h-screen bg-gray-50 font-inter text-gray-800 py-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-col items-center md:items-start gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
            <p className="text-gray-500">Manage PESKON events</p>
          </div>
          <div className="flex gap-3">
            <PrimaryButton to={'/admin/create'} text={buttonText} />
          </div>
        </div>

        {/* Unified Responsive Card Grid */}
        <div className="rounded-xl">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const { hasEnd, startDate, endDate, startTime, endTime, sameDay } = getEventDateParts(event);
                return (
                  <div
                    key={event.id}
                    className={`group relative flex flex-col rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition ${event.is_featured ? 'ring-1 ring-green-300' : 'border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h2 className="font-semibold text-base text-gray-900 leading-snug flex-1 line-clamp-2">
                        {event.title}
                      </h2>
                      {event.is_featured && (
                        <span className="shrink-0 bg-green-100 text-green-700 text-[10px] font-medium px-2 py-1 rounded-full uppercase tracking-wide">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 space-y-0.5 mb-3">
                      <div className="font-medium text-gray-700">
                        {startDate}
                        {hasEnd && !sameDay && (
                          <span> - {endDate}</span>
                        )}
                      </div>
                      <div>{hasEnd ? `${startTime} - ${endTime}` : startTime}</div>
                      {hasEnd && sameDay && (
                        <div className="text-[10px] text-gray-400">Ends: {endDate}</div>
                      )}
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2 items-center">
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded-md text-[11px] font-medium text-gray-700">
                        {event.location || 'No location'}
                      </span>
                    </div>
                    <div className="mt-auto flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <NavLink
                        to={`/admin/edit/${event.id}`}
                        className="text-xs font-medium px-3 py-1.5 rounded-md border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-[.97]"
                      >
                        Edit
                      </NavLink>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:cursor-pointer active:scale-[.97]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
              {events.length === 0 && (
                <div className="col-span-full p-6 text-center text-sm text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  No events found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}