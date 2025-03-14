"use client";
import { useState } from 'react';

// Assuming the Player type is already defined in your codebase
import { Player } from '@/types/player'; // Adjust the path as necessary

interface PlayerEditModalteamProps {
  player: Player; // Use the Player type instead of any
  onSave: (updatedPlayerData: Player) => void; // Updated player data will also follow the Player type
  closeModal: () => void;
}

const PlayerEditModalteam = ({ player, onSave, closeModal }: PlayerEditModalteamProps) => {
  const [updatedPlayerData, setUpdatedPlayerData] = useState<Player>(player); // Typed with Player

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedPlayerData({ ...updatedPlayerData, [name]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await fetch(`/api/getPlayersForTeam/${player.playerId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: player.playerId, 
          updates: updatedPlayerData, // Sending the updated player data here
        }),
      });
  
      if (response.ok) {
        onSave(updatedPlayerData); // Notify parent component about the update
        closeModal(); // Close the modal
      } else {
        console.error('Error updating player data');
      }
    } catch (error) {
      console.error('Error while saving player data:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Player Information</h3>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E1AC6]">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={updatedPlayerData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E1AC6]">Player Position</label>
            <input
              type="text"
              name="playerPosition"
              value={updatedPlayerData.playerPosition}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E1AC6]">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={updatedPlayerData.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E1AC6]">Email</label>
            <input
              type="email"
              name="email"
              value={updatedPlayerData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0E1AC6]">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={updatedPlayerData.contactNumber}
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

export default PlayerEditModalteam;
