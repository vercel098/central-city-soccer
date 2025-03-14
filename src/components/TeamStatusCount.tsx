"use client";
import { useState, useEffect } from 'react';

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <p>Pending Teams: {teamCounts.Pending}</p>
      <p>Approved Teams: {teamCounts.Approved}</p>
    </div>
  );
};

export default TeamStatusCount;
