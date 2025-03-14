// pages/register.tsx
"use client";
import { useState } from 'react';

const RegisterPage = () => {
  const [adminNumber, setAdminNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setError(null);

    // Form validation
    if (!adminNumber || !password) {
      setError('Both admin number and password are required.');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminNumber, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.status === 201) {
      setMessage('Admin registered successfully!');
      setAdminNumber('');
      setPassword('');
    } else {
      setError(data.message || 'An error occurred, please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl text-center font-bold mb-6">Register Admin</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="adminNumber" className="block text-sm font-medium text-gray-700">Admin Number:</label>
          <input
            id="adminNumber"
            type="text"
            value={adminNumber}
            onChange={(e) => setAdminNumber(e.target.value)}
            required
            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error && !adminNumber ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error && !password ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none`}
        >
          {loading ? (
            <div className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin mx-auto"></div>
          ) : (
            'Register'
          )}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>
      )}

      {error && (
        <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>
      )}
    </div>
  );
};

export default RegisterPage;
