// src/hooks/usePlayerProfile.ts
import { useState, useEffect } from "react";

interface Player {
  passportSizePhoto: string;
  playerId: string;
  fullName: string;
  playerPosition: string;
  email: string;
}

interface Team {
  teamName: string;
  teamCategory: string;
  coachName: string;
  teamLogo: string;
}

const usePlayerProfile = (playerId: string | string[]) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!playerId ) return;

      try {
        const response = await fetch(`/api/getUserProfile/${playerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setPlayer(data.player);
        setTeam(data.team);
      } catch (err) {
        setError("Error fetching profile data: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [playerId]);

  return { player, team, loading, error };
};

export default usePlayerProfile;
