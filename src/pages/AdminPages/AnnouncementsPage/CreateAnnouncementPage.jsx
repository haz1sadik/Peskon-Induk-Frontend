import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from 'axios';
import PrimaryButton from '../../../components/ui/button/PrimaryButton';

export default function CreateAnnouncementPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        is_active: true,
      };

      await api.post(`${import.meta.env.VITE_API_BASEURL}/api/admin/announcements`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Announcement created successfully!');
      navigate('/admin/announcements');
    } catch (err) {
      console.error('Create Announcement Error:', err);
      if (err.response && err.response.status === 403) {
        // Forbidden, redirect to login
        navigate('/admin/login');
      }
      alert('Failed to create announcement.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center px-4 py-5 font-inter text-gray-800 bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl h-fit p-8 w-full max-w-3xl border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Create Announcement</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-sm">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#38ab70]"
              placeholder="e.g. Important Update"
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-semibold mb-2 text-sm">Content</label>
            <div className="bg-white rounded-xl">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                className="h-48 mb-12 rounded-xl"
                placeholder="Write the announcement content..."
              />
            </div>
          </div>
          <PrimaryButton text={isLoading ? 'Submitting...' : 'Create Announcement'} disabled={isLoading} />
        </form>
      </div>
    </div>
  );
}