const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    ...options.headers,
  };


  // prevent the "Body cannot be empty" error on DELETE/GET requests
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['access-token'] = token;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // handle 204 No Content specifically
  // because response.json() will crash on an empty response
  if (response.status === 204) {
    return {} as T; 
  }

  const data = await response.json().catch(() => ({})); // Safe parse

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Something went wrong');
  }

  return data.data || data;
}