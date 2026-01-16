'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-200">
          Fastify App
        </Link>
        
        <div className="flex gap-4 items-center">
          {!user ? (
            <>
              <Link href="/register" className="hover:text-gray-300 transition">
                Register
              </Link>
              <Link 
                href="/login" 
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition font-medium"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              {user.role?.admin && (
                <Link href="/admin/users" className="text-yellow-400 hover:text-yellow-300 font-semibold transition">
                  Admin Panel
                </Link>
              )}
              
              <Link href="/profile" className="hover:text-gray-300 transition">
                {user.username}
              </Link>
              
              <button 
                onClick={logout} 
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}