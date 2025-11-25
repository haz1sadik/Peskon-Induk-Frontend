import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

export default function EventAttendanceListPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [eventName, setEventName] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    // Redirect if not authenticated
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) navigate('/admin/login');
    }, [navigate]);

    useEffect(() => {
        const fetchAttendance = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return; // already redirected above
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASEURL}/api/admin/attendance/${eventId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setEventName(res.data.event || 'Event');
                setAttendance(Array.isArray(res.data.attendance) ? res.data.attendance : []);
            } catch (err) {
                console.error('Failed to fetch attendance', err);
                if (err.response && err.response.status === 403) {
                    // Forbidden, redirect to login
                    navigate('/admin/login');
                }
                setError('Failed to fetch attendance.');
            } finally {
                setLoading(false);
            }
        };
        if (eventId) fetchAttendance();
    }, [eventId]);

    const filtered = useMemo(() => {
        if (!search.trim()) return attendance;
        const q = search.toLowerCase();
        return attendance.filter(a =>
            (a.name || '').toLowerCase().includes(q) ||
            (a.matric_no || '').toLowerCase().includes(q) ||
            (a.college || '').toLowerCase().includes(q)
        );
    }, [attendance, search]);

    const collegeStats = useMemo(() => {
        if (!attendance.length) return [];
        const counts = attendance.reduce((acc, cur) => {
            const key = (cur.college || 'Unknown').trim() || 'Unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [attendance]);

    return (
        <div className="w-full min-h-screen bg-gray-50 font-inter text-gray-800 py-10 px-4 flex justify-center">
            <div className="w-full max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="space-y-1">
                        <NavLink to="/admin/attendance" className="text-sm text-blue-600 hover:underline">
                            &larr; Back to Attendances
                        </NavLink>
                        <h1 className="text-3xl font-bold text-gray-900">{eventName}</h1>
                        <p className="text-gray-500 text-sm">Attendance List</p>
                    </div>
                    <div className="w-full md:w-auto flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search name / matric / college"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full md:w-72 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
                        {loading ? (
                            <div className="p-10 text-center text-gray-500">Loading attendance...</div>
                        ) : error ? (
                            <div className="p-10 text-center text-red-500 text-sm">{error}</div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-100 text-gray-700">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-semibold">#</th>
                                                <th className="px-4 py-2 text-left font-semibold">Name</th>
                                                <th className="px-4 py-2 text-left font-semibold">Matric No</th>
                                                <th className="px-4 py-2 text-left font-semibold">College</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map((a, idx) => (
                                                <tr key={idx} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors">
                                                    <td className="px-4 py-2 text-gray-500 w-12">{idx + 1}</td>
                                                    <td className="px-4 py-2 font-medium text-gray-900">{a.name || '-'}</td>
                                                    <td className="px-4 py-2 text-gray-700">{a.matric_no || '-'}</td>
                                                    <td className="px-4 py-2 text-gray-700">{a.college || '-'}</td>
                                                </tr>
                                            ))}
                                            {filtered.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No matching attendance records.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                    <span>Total: {attendance.length}</span>
                                    {search && <span>Filtered: {filtered.length}</span>}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 w-full lg:w-64 h-fit">
                        <h2 className="text-sm font-semibold text-gray-700 mb-2">Colleges (by attendance)</h2>
                        {loading ? (
                            <div className="py-6 text-center text-gray-500 text-xs">Loading...</div>
                        ) : error ? (
                            <div className="py-6 text-center text-red-500 text-xs">--</div>
                        ) : collegeStats.length ? (
                            <ol className="space-y-1 text-sm">
                                {collegeStats.map(([college, count], i) => (
                                    <li key={college} className="flex justify-between gap-3">
                                        <span className="truncate max-w-[11rem]">{i + 1}. {college}</span>
                                        <span className="font-medium text-gray-700">{count}</span>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <div className="py-4 text-xs text-gray-500">No attendance yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}