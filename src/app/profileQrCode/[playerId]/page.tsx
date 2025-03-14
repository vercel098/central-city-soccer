"use client"; // Ensure the component uses the client-side hooks

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Import useParams for dynamic routes
import Image from "next/image";

interface Player {
  playerId: string;
  fullName: string;
  dob: string;
  type: string;
  nationality: string;
  contactNumber: string;
  email?: string;
  teamAssignment: string;
  playerPosition: string;
  documents: {
    birthCertificate: string;
    passportSizePhoto: string;
  };
  guardianInfo?: {
    guardianName: string;
    guardianContactNumber: string;
  };
  registrationDate: string;
  status: string;
}

interface Team {
  teamName: string;
  coachName: string;
  teamLogo: string;
  assistantCoachName: string;
  players: Player[];
}

const ProfileQrCodePage = () => {
  const { playerId } = useParams(); // Access playerId using useParams hook

  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [teamData, setTeamData] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) return;  // Check if playerId is available

    const fetchPlayerData = async () => {
      try {
        const playerResponse = await fetch(`/api/player/${playerId}`);
        if (!playerResponse.ok) {
          throw new Error("Player not found");
        }
        const playerData = await playerResponse.json();
        setPlayerData(playerData);

        // Fetch team data associated with the player
        const teamResponse = await fetch(`/api/team/${playerData.teamAssignment}`);
        if (!teamResponse.ok) {
          throw new Error("Team not found");
        }
        const teamData = await teamResponse.json();
        setTeamData(teamData);
      } catch (error: unknown) { // Explicitly type the error as 'unknown'
        if (error instanceof Error) { // Check if error is an instance of Error
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId]);  // Trigger effect when playerId changes

  if (loading) {
    return <p>Loading player and team data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!playerData || !teamData) {
    return <p>No player or team data available</p>;
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1; // Subtract 1 year if the birthday hasn't occurred yet this year
    }
    return age;
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      {/* Player Passport Photo */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
          <Image
            src={playerData.documents.passportSizePhoto}
            alt="Passport Photo"
            className="rounded-full shadow-lg object-cover w-full h-full"
            layout="fill" // Automatically adjust image size based on container
            objectFit="cover"
          />
        </div>
      </div>

      <h1 className="text-3xl font-semibold text-center mb-4">{playerData.fullName}s Profile</h1>

      {/* Player Information */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <p><strong className="text-gray-700">Player ID:</strong> {playerData.playerId}</p>
          <p><strong className="text-gray-700">Age:</strong> {calculateAge(playerData.dob)} years</p>
        </div>
        <p><strong className="text-gray-700">Type:</strong> {playerData.type}</p>
        <p><strong className="text-gray-700">Nationality:</strong> {playerData.nationality}</p>
        <p><strong className="text-gray-700">Email:</strong> {playerData.email || 'N/A'}</p>
        <p><strong className="text-gray-700">Player Position:</strong> {playerData.playerPosition}</p>
      </div>
      

      {/* Team Information */}
      
      <div className="mt-8 ">
        
        <h2 className="text-2xl font-semibold text-gray-800 flex justify-center mb-4">Team Information</h2>
        <div className="flex justify-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40  ">
              <Image
                src={teamData.teamLogo}
                alt="Team Logo"
                className="rounded-full shadow-lg object-cover w-full h-full"
                layout="fill" // Automatically adjust image size based on container
                objectFit="cover"
              />
            </div>
          </div>
        <div className="space-y-2">
          <p><strong className="text-gray-700">Team Name:</strong> {teamData.teamName}</p>
          <p><strong className="text-gray-700">Coach:</strong> {teamData.coachName}</p>
          <div>
                <strong className="font-medium text-gray-800">Assistant Coach Name:</strong> {teamData.assistantCoachName}
              </div>
        
        </div>
      </div>

    </div>
  );
};

export default ProfileQrCodePage;
