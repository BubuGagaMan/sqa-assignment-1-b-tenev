'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface UserData {
  id: string;
  username: string;
  email: string;
  role?: { admin: boolean };
}

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.role?.admin) {
        // Redirect if not logged in or not admin
        router.push('/');
        return;
      }
      fetchUsers();
    }
  }, [user, isLoading, router]);

  const fetchUsers = async () => {
    try {
      // Backend: GET /user
      const response = await apiFetch<{ users: UserData[] }>('/user');
      setUsers(response.users);
    } catch (err: any) {
      setFetchError(err.message);
    }
  };

  const handleDelete = async (userId: string) => {
    if(!confirm("Are you sure?")) return;
    
    try {
        // Backend: DELETE /user/:userId
        await apiFetch(`/user/${userId}`, { method: 'DELETE' });
        // Refresh list
        setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
        alert("Failed to delete: " + err.message);
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (!user?.role?.admin) return null; // Don't render while redirecting

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management (Admin)</h1>
      
      {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Username</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">
                {u.role?.admin ? (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Admin</span>
                ) : (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">User</span>
                )}
              </td>
              <td className="border p-2">
                <button 
                  onClick={() => handleDelete(u.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}