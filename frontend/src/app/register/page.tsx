'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/utils/api';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await apiFetch('/user', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // redirect to login on success
      alert("Account created successfully! Please log in.");
      router.push('/login');
      
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white border p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-center text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Username</label>
          <input
            name="username"
            type="text"
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`mt-4 w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in here
        </Link>
      </div>
    </div>
  );
}