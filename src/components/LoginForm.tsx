"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';  // For client-side navigation
import Navbar2 from './Navbar2';

export default function LoginForm() {
  const [playerId, setPlayerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();  // Initialize Next.js router for navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/playerlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, password }), // Send playerId and password
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Assuming the response contains a token
        localStorage.setItem('token', data.token); // Store token in localStorage
        router.push('/playeruserprofile'); // Redirect to dashboard or another page using useRouter
      } else {
        setError(data.message || 'Login failed'); // Show error if login failed
      }
    } catch  {
      setError('An error occurred, please try again.'); // Handle errors from the fetch request
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <Navbar2 />

      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="w-full">
            <label htmlFor="playerId" className="block text-sm font-medium text-[#0E1AC6]">Player ID</label>
            <input
              type="text"
              id="playerId"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your Player ID"
            />
          </div>

          <div className="w-full">
            <label htmlFor="password" className="block text-sm font-medium text-[#0E1AC6]">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="w-full">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
