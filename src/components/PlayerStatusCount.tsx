"use client";
import { useState, useEffect } from 'react';

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
      } catch  {
        setError('Error fetching player counts');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <p>Pending Players: {playerCounts.Pending}</p>
      <p>Approved Players: {playerCounts.Approved}</p>
    </div>
  );
};

export default PlayerStatusCount;
