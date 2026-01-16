'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/utils/api';

export default function ProfilePage() {
  const { user, isLoading, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  // existing user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setMsg({ type: '', text: '' });
    setIsSaving(true);

    try {
      await apiFetch(`/user/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          // send password if the user actually typed something
          ...(formData.password ? { password: formData.password } : {})
        }),
      });

      await refreshUser();

      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      
      // clear password field after success
      setFormData(prev => ({ ...prev, password: '' }));

    } catch (err: any) {
      setMsg({ type: 'error', text: 'Error: ' + err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10">Please log in.</div>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        
        <div className="mb-6 pb-4 border-b">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">User ID</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 inline-block text-gray-700">
            {user.id}
          </p>
        </div>
        
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          
          {/* Username Field */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Username</label>
            <input 
              name="username"
              type="text" 
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email Address</label>
            <input 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              New Password <span className="text-gray-400 font-normal text-sm">(Leave blank to keep current)</span>
            </label>
            <input 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
              minLength={6}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isSaving}
            className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition ${isSaving ? 'opacity-50' : ''}`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
        
        {/* Status Messages */}
        {msg.text && (
          <div className={`mt-4 p-3 rounded text-center ${
            msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}