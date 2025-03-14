import { useState } from 'react';

// Define Player interface to avoid using 'any' type
interface Player {
  playerId: string;
  fullName: string;
  dob: string;
  nationality: string;
  contactNumber: string;
  email: string;
  playerPosition: string;
  status: string;
  registrationDate: string;
}

interface TeamData {
  teamLogo: string;
  teamName: string;
  teamCategory: string;
  coachName: string;
  assistantCoachName: string;
  maxPlayers: number;
  players: Player[]; // Use the Player type instead of 'any[]'
  createdAt: string;
  updatedAt: string;
}

interface TeamEditModalteamProps {
  teamData: TeamData;
  onSave: (updatedTeamData: TeamData) => void;
  closeModal: () => void;
}

const TeamEditModalteam = ({ teamData, onSave, closeModal }: TeamEditModalteamProps) => {
  const [updatedTeamData, setUpdatedTeamData] = useState<TeamData>(teamData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedTeamData({ ...updatedTeamData, [name]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const response = await fetch('/api/getTeamProfile', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates: updatedTeamData }),
    });

    if (response.ok) {
      onSave(updatedTeamData); // Notify parent component about the update
      closeModal(); // Close the modal
    } else {
      console.error('Error updating team data');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Team Information</h3>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E1AC6]">Team Name</label>
            <input
              type="text"
              name="teamName"
              value={updatedTeamData.teamName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E1AC6]">Coach Name</label>
            <input
              type="text"
              name="coachName"
              value={updatedTeamData.coachName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E1AC6]">Assistant Coach Name</label>
            <input
              type="text"
              name="assistantCoachName"
              value={updatedTeamData.assistantCoachName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E1AC6]">Max Players</label>
            <input
              type="number"
              name="maxPlayers"
              value={updatedTeamData.maxPlayers}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-black rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamEditModalteam;
