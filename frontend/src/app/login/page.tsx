'use client';

import { useState } from 'react';
import { apiFetch } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // backend returns { message: "...", data: { accessToken: "..." } }
            const response = await apiFetch<{ accessToken: string }>('/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            await login(response.accessToken);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 border p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Login</h1>

            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1">Username</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-2">
                    Sign In
                </button>
            </form>
            <div className="mt-4 text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link href="/register" className="text-blue-600 hover:underline">
                    Register here
                </Link>
            </div>
        </div>
    );
}