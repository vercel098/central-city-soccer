"use client";
import Nabvar3 from '@/components/Nabvar3';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Component for Team Status Count with Cards
const TeamStatusCount = () => {
  const [teamCounts, setTeamCounts] = useState({ Pending: 0, Approved: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/team/count');
        const data = await res.json();
        if (res.status === 200) {
          setTeamCounts(data);
        } else {
          setError('Failed to fetch team counts');
        }
      } catch {
        setError('Error fetching team counts');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-center mb-4">Team Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-medium text-blue-600">Pending</h4>
            <p className="text-2xl font-bold">{teamCounts.Pending}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-medium text-green-600">Approved</h4>
            <p className="text-2xl font-bold">{teamCounts.Approved}</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <button 
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Link href="/admin/teamList" >
              Team List
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for Player Status Count with Cards
const PlayerStatusCount = () => {
  const [playerCounts, setPlayerCounts] = useState({ Pending: 0, Approved: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/player/count');
        const data = await res.json();
        if (res.status === 200) {
          setPlayerCounts(data);
        } else {
          setError('Failed to fetch player counts');
        }
      } catch {
        setError('Error fetching player counts');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-center mb-4">Player Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-medium text-blue-600">Pending</h4>
            <p className="text-2xl font-bold">{playerCounts.Pending}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-medium text-green-600">Approved</h4>
            <p className="text-2xl font-bold">{playerCounts.Approved}</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <button 
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Link href="/admin/playerList" >
              Player List
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

function Page() {
  return (
    <div>
      <Nabvar3 />
      <div className="space-y-8">
        <TeamStatusCount />
        <PlayerStatusCount />
      </div>
    </div>
  );
}

export default Page;
