"use client";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TeamEditModalteam from '@/components/TeamEditModalteam';
import PlayerEditModalteam from '@/components/PlayerEditModalteam';
import PlayerCard from '@/components/PlayerCard';
import Navbar2 from '@/components/Navbar2';

// Define types for team data and player data
interface Player {
  playerId: string;
  fullName: string;
  dob: string;
  nationality: string;
  contactNumber: string;
  email: string;
  playerPosition: string;
  status: string;
  documents?: {
    birthCertificate?: string;
    passportSizePhoto?: string;
  };
  guardianInfo?: {
    guardianName: string;
    guardianContactNumber: string;
  };
  registrationDate: string;
}

interface Team {
  teamLogo: string;
  teamName: string;
  teamCategory: string;
  coachName: string;
  assistantCoachName: string;
  maxPlayers: number;
  players: Player[];
  createdAt: string;
  updatedAt: string;
}

const TeamUserProfile = () => {
  const [teamData, setTeamData] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingTeam, setEditingTeam] = useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number | null>(null);
  const router = useRouter();

  // Add the fetch functions as dependencies
  const fetchTeamData = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/getTeamProfile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTeamData(data.team); // Assuming response contains the team data
      } else {
        console.error('Error fetching team data');
        router.push('/teamLoginForm');
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      router.push('/teamLoginForm');
    }
  }, [router]);

  const fetchPlayersData = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/getPlayersForTeam', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPlayers(data.players); // Assuming response contains player data
      } else {
        console.error('Error fetching players data');
      }
    } catch (error) {
      console.error('Error fetching players data:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/teamLoginForm');
    } else {
      fetchTeamData(token);
      fetchPlayersData(token); // Fetch player data
    }
  }, [router, fetchTeamData, fetchPlayersData]); // Include fetch functions in dependency array

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1; // Subtract 1 year if the birthday hasn't occurred yet this year
    }
    return age;
  };

  const approvePlayer = async (playerId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
  
    const player = players.find(player => player.playerId === playerId);
    if (!player) return;
  
    const response = await fetch(`/api/approvePlayer/${playerId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      // Send SMS after player is approved
      await sendPlayerApprovalSMS(player);
  
      // Update the players state with the updated status
      setPlayers(players.map(player =>
        player.playerId === playerId ? { ...player, status: 'Approved' } : player
      ));
    } else {
      console.error('Error approving player');
    }
  };
  
  const sendPlayerApprovalSMS = async (player: Player) => {
    const response = await fetch('/api/sendPlayerApprovalSMS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: player.fullName,
        playerPhone: player.contactNumber,
        teamName: teamData?.teamName,
        playerId: player.playerId,
      }),
    });
  
    if (!response.ok) {
      console.error('Failed to send SMS');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    router.push("/"); // Redirect to the home page or login page
  };

  // Function to delete a player
  const deletePlayer = async (playerId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const response = await fetch(`/api/approvePlayer/${playerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Update the players state after deletion
      setPlayers(players.filter(player => player.playerId !== playerId));
    } else {
      console.error('Error deleting player');
    }
  };

 
  if (!teamData) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <Navbar2 />

      <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Team Profile</h2>
          <p className="text-lg sm:text-xl text-gray-600">Heres a summary of your teams information</p>
        </div>

        <div className="space-y-8">
          <div className="flex justify-center mb-8">
            <div className="relative w-32 sm:w-40 h-32 sm:h-40 cursor-pointer">
              <Image
                src={teamData.teamLogo}
                alt="Team Logo"
                layout="fill"
                objectFit="cover"
                className="rounded-full shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-5">Team Information</h3>
              <div className="space-y-4 text-base sm:text-lg">
                <div><strong className="font-medium text-gray-800">Team Name:</strong> {teamData.teamName}</div>
                <div><strong className="font-medium text-gray-800">Team Category:</strong> {teamData.teamCategory}</div>
                <div><strong className="font-medium text-gray-800">Coach Name:</strong> {teamData.coachName}</div>
                <div><strong className="font-medium text-gray-800">Assistant Coach Name:</strong> {teamData.assistantCoachName}</div>
              </div>
              <button onClick={() => setEditingTeam(true)} className="text-green-500 mt-4">Edit Team</button>
            </div>

            <div className="p-6 sm:p-8 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-5">Team Stats</h3>
              <div className="space-y-4 text-base sm:text-lg">
                <div><strong className="font-medium text-gray-800">Max Players:</strong> {teamData.maxPlayers}</div>
                <div><strong className="font-medium text-gray-800">Member Count:</strong> {teamData.players.length}</div>
                <div><strong className="font-medium text-gray-800">Created At:</strong> {new Date(teamData.createdAt).toLocaleString()}</div>
                <div><strong className="font-medium text-gray-800">Updated At:</strong> {new Date(teamData.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {players.length > 0 ? (
            <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-5">Players</h3>
              <ul className="space-y-4">
                {players.map((player, index) => (
                  <li key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg shadow-md">
                    <div><strong className="font-medium text-gray-800">Full Name:</strong> {player.fullName}</div>
                    <div><strong className="font-medium text-gray-800">Player Position:</strong> {player.playerPosition}</div>

                    <PlayerCard player={player} teamData={teamData}   />

                    <button onClick={() => setActivePlayerIndex(activePlayerIndex === index ? null : index)} className="text-blue-500 text-sm sm:text-base mt-2">
                      {activePlayerIndex === index ? 'Hide Details' : 'Show Details'}
                    </button>

                    <button onClick={() => setEditingPlayer(player)} className="text-green-500 text-sm sm:text-base mt-2 ml-4">Edit Player</button>

                    {player.status === 'Pending' && (
                      <button onClick={() => approvePlayer(player.playerId)} className="text-blue-500 text-sm sm:text-base mt-2 ml-4">
                        Approve Player
                      </button>
                    )}

                    <button onClick={() => deletePlayer(player.playerId)} className="text-red-500 text-sm sm:text-base mt-2 ml-4">
                      Delete Player
                    </button>

                    {activePlayerIndex === index && (
                      <div className="space-y-4 mt-4 text-sm sm:text-base ">
                        <div><strong className="font-medium text-gray-800">Player ID:</strong> {player.playerId}</div>
                        <div><strong className="font-medium text-gray-800">Age:</strong> {calculateAge(player.dob)} years</div>
                        <div><strong className="font-medium text-gray-800">Nationality:</strong> {player.nationality}</div>
                        <div><strong className="font-medium text-gray-800">Contact Number:</strong> {player.contactNumber}</div>
                        {player.email && <div><strong className="font-medium text-gray-800 break-words">Email: {player.email}</strong></div>}
                        <div><strong className="font-medium text-gray-800">Player Position:</strong> {player.playerPosition}</div>

                        <div><strong className="font-medium text-gray-800">Documents:</strong>
                          {player.documents ? (
                            <>
                              {player.documents.birthCertificate && (
                                <div>Birth Certificate: <a href={player.documents.birthCertificate} target="_blank" className="text-blue-500">View</a></div>
                              )}
                              {player.documents.passportSizePhoto && (
                                <div>Passport Photo: <a href={player.documents.passportSizePhoto} target="_blank" className="text-blue-500">View</a></div>
                              )}
                            </>
                          ) : (
                            <div className="text-gray-500">No documents available</div>
                          )}
                        </div>

                        {player.guardianInfo && (
                          <div><strong className="font-medium text-gray-800">Guardian Info:</strong>
                            <div>Guardian Name: {player.guardianInfo.guardianName}</div>
                            <div>Guardian Contact Number: {player.guardianInfo.guardianContactNumber}</div>
                          </div>
                        )}

                        <div><strong className="font-medium text-gray-800">Registration Date:</strong> {new Date(player.registrationDate).toLocaleDateString()}</div>
                        <div><strong className="font-medium text-gray-800">Status:</strong> {player.status}</div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center text-gray-600 py-6">No players added yet.</div>
          )}
        </div>

        <div className="mt-4">
          <button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            Logout
          </button>
        </div>

        {editingTeam && (
          <TeamEditModalteam teamData={teamData} onSave={(updatedTeam) => {
            setTeamData(updatedTeam);
            setEditingTeam(false); // Close modal
          }} closeModal={() => setEditingTeam(false)} />
        )}

        {editingPlayer && (
          <PlayerEditModalteam player={editingPlayer} onSave={(updatedPlayer) => {
            setPlayers(players.map(p => p.playerId === updatedPlayer.playerId ? updatedPlayer : p));
            setEditingPlayer(null); // Close modal
          }} closeModal={() => setEditingPlayer(null)} />
        )}
      </div>
    </div>
  );
};

export default TeamUserProfile;
