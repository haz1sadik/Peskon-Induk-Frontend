import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "axios";
import PrimaryButton from "../../../components/ui/button/PrimaryButton";

export default function AllAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // AUTH CHECK
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) navigate("/admin/login");
    }, [navigate]);

    // FETCH ANNOUNCEMENTS
    useEffect(() => {
        const fetchAnnouncements = async () => {
            if (!localStorage.getItem("accessToken")) return;
            try {
                const res = await api.get(`${import.meta.env.VITE_API_BASEURL}/api/announcements`);
                setAnnouncements(res.data || []);
            } catch (err) {
                console.error("Error fetching announcements", err);
                alert("Failed to fetch announcements.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    // DELETE ANNOUNCEMENT
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this announcement?")) return;
        try {
            await api.delete(`${import.meta.env.VITE_API_BASEURL}/api/admin/announcements/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            });
            setAnnouncements((prev) => prev.filter((a) => a.id !== id));
            alert("Announcement deleted successfully");
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 403) {
                // Forbidden, redirect to login
                navigate('/admin/login');
            }
            alert("Failed to delete announcement.");
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
            <span>New Announcement</span>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gray-50 font-inter text-gray-800 py-10 px-4 flex justify-center">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">Manage Announcements</h1>
                        <p className="text-gray-500">Create and manage announcements</p>
                    </div>
                    <div className="flex gap-3">
                        <PrimaryButton to={'/admin/announcements/create'} text={buttonText} />
                    </div>
                </div>

                {/* Cards */}
                <div className="rounded-xl">
                    {loading ? (
                        <div className="p-10 text-center text-gray-500">Loading...</div>
                    ) : (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {announcements.map((a) => (
                                <div
                                    key={a.id}
                                    className="group relative flex flex-col rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition border-gray-200"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <h2 className="font-semibold text-base text-gray-900 leading-snug flex-1 line-clamp-2">
                                            {a.title}
                                        </h2>
                                    </div>
                                    <div className="text-xs text-gray-600 space-y-2 mb-3">
                                        <div
                                            className="prose prose-sm max-w-none line-clamp-5"
                                            dangerouslySetInnerHTML={{ __html: a.content || '' }}
                                        />
                                    </div>
                                    <div className="mt-auto flex justify-end gap-2 pt-2 border-t border-gray-100">
                                        <button
                                            onClick={() => handleDelete(a.id)}
                                            className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:cursor-pointer active:scale-[.97]"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {announcements.length === 0 && (
                                <div className="col-span-full p-6 text-center text-sm text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                                    No announcements found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}