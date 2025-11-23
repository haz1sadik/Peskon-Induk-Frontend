import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from 'axios';

// Parse custom format: 2024-07-01T10:00:00MYT (Malaysia Time UTC+8)
function parseMYT(str) {
    if (!str) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})MYT$/.exec(str);
    if (!match) {
        const fallback = new Date(str);
        return isNaN(fallback) ? null : fallback;
    }
    const [_, y, m, d, hh, mm, ss] = match;
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

export default function AttendancePage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qrImages, setQrImages] = useState({}); // eventId -> qr_image_url
    const navigate = useNavigate();

    // Auth redirect
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) navigate('/admin/login');
    }, [navigate]);

    // Fetch events
    useEffect(() => {
        const fetchEvents = async () => {
            if (!localStorage.getItem('accessToken')) return;
            try {
                const res = await api.get(`${import.meta.env.VITE_API_BASEURL}/api/events`);
                setEvents(res.data);
            } catch (err) {
                console.error('Error fetching events', err);
                alert('Failed to fetch events.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleShowQR = async (eventId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        try {
            // Try to get existing active QR
            const res = await api.get(`${import.meta.env.VITE_API_BASEURL}/api/admin/events/qr/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data?.qr_image_url) {
                setQrImages((prev) => ({ ...prev, [eventId]: res.data.qr_image_url }));
                return;
            }
        } catch (err) {
            // If 404 with specific message, generate new QR
            const status = err?.response?.status;
            const message = err?.response?.data?.message;
            if (status === 404 && message === 'No active QR code found for this event') {
                try {
                    const genRes = await api.post(`${import.meta.env.VITE_API_BASEURL}/api/admin/events/generate-qr/${eventId}`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (genRes.data?.qr_image_url) {
                        setQrImages((prev) => ({ ...prev, [eventId]: genRes.data.qr_image_url }));
                        return;
                    }
                } catch (genErr) {
                    console.error('Error generating QR code', genErr);
                    alert('Failed to generate QR code.');
                    return;
                }
            } else {
                console.error('Error retrieving QR code', err);
                alert('Failed to retrieve QR code.');
                return;
            }
        }
    };

    const handleDownloadQR = async (eventId, title) => {
        const url = qrImages[eventId];
        if (!url) {
            // If not already fetched, attempt to fetch first then download.
            await handleShowQR(eventId);
        }
        const finalUrl = qrImages[eventId];
        if (!finalUrl) return;
        try {
            const response = await fetch(finalUrl, { mode: 'cors' });
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safeTitle = (title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            a.href = objectUrl;
            a.download = `${safeTitle}-qr.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(objectUrl);
        } catch (err) {
            console.error('QR download failed, opening in new tab instead.', err);
            window.open(finalUrl, '_blank');
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 font-inter text-gray-800 py-10 px-4 flex justify-center">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">Event Attendance</h1>
                        <p className="text-gray-500">Select an event to view attendance</p>
                    </div>
                </div>

                {/* Card Grid */}
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
                                        className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-1">
                                            <h2 className="font-semibold text-base text-gray-900 leading-snug flex-1 line-clamp-2">{event.title}</h2>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-0.5 mb-3">
                                            <div className="font-medium text-gray-700">
                                                {startDate}
                                                {hasEnd && !sameDay && <span> - {endDate}</span>}
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
                                        <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-gray-100">
                                            <div className="flex justify-end gap-2">
                                                <NavLink
                                                    to={`/admin/attendance/${event.id}`}
                                                    className="text-xs font-medium px-3 py-1.5 rounded-md border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-[.97] hover:cursor-pointer"
                                                >
                                                    View Attendance
                                                </NavLink>
                                                <button
                                                    type="button"
                                                    onClick={() => handleShowQR(event.id)}
                                                    className="text-xs font-medium px-3 py-1.5 rounded-md border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 active:scale-[.97] hover:cursor-pointer"
                                                >
                                                    Show QR
                                                </button>
                                            </div>
                                            {qrImages[event.id] && (
                                                <div className="pt-2 border-t border-gray-100 flex flex-col items-center gap-2">
                                                    <img
                                                        src={qrImages[event.id]}
                                                        alt={`QR code for event ${event.title}`}
                                                        className="w-32 h-32 object-contain"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDownloadQR(event.id, event.title)}
                                                        className="text-[11px] font-medium px-3 py-1.5 rounded-md border border-green-300 bg-green-200/40 text-green-800 hover:bg-green-200 active:scale-[.97] hover:cursor-pointer"
                                                    >
                                                        Download QR
                                                    </button>
                                                </div>
                                            )}
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