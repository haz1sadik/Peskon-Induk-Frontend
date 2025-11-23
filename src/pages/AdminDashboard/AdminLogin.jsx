import React, { useState } from 'react'
import TextInputField from '../../components/ui/input/TextInputField.jsx'
import PrimaryButton from '../../components/ui/button/PrimaryButton.jsx'
import api from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        await api.post(`${import.meta.env.VITE_API_BASEURL}/api/admin/login`, {
            username,
            password
        }).then(res => {
            localStorage.setItem('accessToken', res.data.accessToken);
            setLoading(false);
            navigate('/admin');
        })
        .catch(err => {
            setLoading(false);
            setError(err.response.data.message);
        });
    }
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            <div className="absolute right-0 lg:top-0 -top-20 -z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="864" height="722" viewBox="0 0 864 722" fill="none" className='w-auto h-150 lg:h-250'>
                    <path d="M257 140C121.4 152.8 29.1667 52 0 0L864 3.5V721.5H767.5C468.7 683.5 519 532 581.5 461C618 411.167 684 291.1 656 209.5C621 107.5 426.5 124 257 140Z" fill="#B9FFC8" />
                </svg>
            </div>
            <div className="absolute -bottom-10 lg:bottom-0 -left-10 lg:left-0 -z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="522" height="648" viewBox="0 0 522 648" fill="none" className='w-auto h-130 lg:h-auto'>
                    <path d="M522 362C522 561.927 359.927 724 160 724C-39.9271 724 -202 561.927 -202 362C-202 162.073 -39.9271 0 160 0C359.927 0 522 162.073 522 362Z" fill="#B1FFC2" />
                    <path d="M446 362C446 519.953 317.953 648 160 648C2.04655 648 -126 519.953 -126 362C-126 204.047 2.04655 76 160 76C317.953 76 446 204.047 446 362Z" fill="#DDFFE2" />
                    <path d="M379 362C379 482.95 280.95 581 160 581C39.0496 581 -59 482.95 -59 362C-59 241.05 39.0496 143 160 143C280.95 143 379 241.05 379 362Z" fill="#BFFFCC" />
                </svg>
            </div>

            <div className="flex flex-col  px-6 py-8 rounded-4xl bg-white/70 backdrop-blur shadow">
                {error && <p className='p-3 pl-5 rounded-xl text-red-500 bg-red-200 mb-4'>{error}</p>}
                <img src="/PESKON2025_Logo.png" alt="PESKON 2025 Logo" className='h-20 object-contain' />
                <form onSubmit={handleLogin} className='flex flex-col gap-8 mt-6'>
                    <div className='flex flex-col gap-4'>
                        <TextInputField label='Username' placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        <TextInputField label='Password' placeholder='Enter password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    { !loading ? <PrimaryButton text='Login'/> : <PrimaryButton text='Login' disabled/>}
                </form>
            </div>
        </div>
    )
}

export default AdminLogin