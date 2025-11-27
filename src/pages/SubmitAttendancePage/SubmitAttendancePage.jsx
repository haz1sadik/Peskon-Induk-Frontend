import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import TextInputField from '../../components/ui/input/TextInputField.jsx';
import PrimaryButton from '../../components/ui/button/PrimaryButton.jsx';
import axios from '../../axios.js';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';


const collegeOptions = ["Pelajar Luar Kampus (PLK)", "Bukan Pelajar", "Kolej Canselor (KC)", "Kolej Tun Dr Ismail (KTDI)", "Kolej Sultan Alaeddin Suleiman Shah (KOSASS)", "Kolej Pendeta Za’ba (KPZ)", "Kolej Tan Sri Aishah Ghani (KTAG)", "Kolej Dua Belas (K12)", "Kolej Empat Belas (K14)", "Kolej Sepuluh (K10)", "Kolej Tan Sri Mustaffa Babjee (KMB)"];

const SubmitAttendancePage = () => {
    const { qr_token } = useParams();

    const [name, setName] = useState('');
    const [matricNo, setMatricNo] = useState('');
    const [college, setCollege] = useState(collegeOptions[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASEURL}/api/admin/attendance`, {
                qr_token: qr_token,
                name: name.trim(),
                matric_no: matricNo.trim() || "-",
                college,
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
            setSuccess('Attendance submitted successfully.');
            setName('');
            setMatricNo('');
            setCollege(collegeOptions[0]);
        } catch (err) {
            if (err.response) {
                if (err.response.status === 409) {
                    setError(err.response.data?.message || 'Your matric number has already been submitted for this event');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    setError(err.response.data?.message || 'Submission failed.');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else {
                setError('Network error, please try again.');
                console.log(err);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col w-full min-h-screen">
                <Navbar />
                <div className="flex">
                    <div className="w-full flex flex-col items-center justify-start bg-[#f5f8fa] p-4">
                        <div className="max-w-md bg-white rounded-2xl shadow-md p-6 flex flex-col gap-6">
                            {error && (
                                <div className="text-red-600 text-md font-bold bg-red-50 px-3 py-2 rounded-lg">{error}</div>
                            )}
                            {success && (
                                <div className="text-green-600 text-md font-bold bg-green-50 px-3 py-2 rounded-lg">{success}</div>
                            )}
                            <img src="/PESKON2025_Logo.png" alt="peskon2025 logo" className='object-contain h-15' />
                            <h1 className="text-xl font-semibold text-center">Submit Attendance</h1>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <TextInputField
                                    label="Name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                />
                                <TextInputField
                                    label="Matric No (Leave empty if not a student)"
                                    name="matric_no"
                                    value={matricNo}
                                    onChange={(e) => setMatricNo(e.target.value)}
                                    placeholder="Enter matric number"
                                />
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="college" className="text-md text-black">College</label>
                                    <select
                                        id="college"
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        className="max-w-80 h-[2.8125rem] border-2 border-[#a8b9c7] px-[1rem] py-[0.625rem] text-sm rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-peskon-primary focus:border-sonetra-primary bg-white"
                                        required
                                    >
                                        {collegeOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-2">
                                    <PrimaryButton
                                        text={loading ? 'Submitting...' : 'Submit Attendance'}
                                        disabled={loading}
                                        onClick={handleSubmit}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default SubmitAttendancePage;