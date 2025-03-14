"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Define the interface for the Player
interface Player {
  _id: string;
  playerId: string;
  fullName: string;
  dob: string;
  type: 'Men’s' | 'Youth’s' | 'Women’s';
  nationality: string;
  contactNumber: string;
  email?: string;
  password: string;
  teamAssignment: string;
  playerPosition: 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
  registrationDate: Date;
  status: 'Pending' | 'Approved';
  documents: {
    birthCertificate: string;
    passportSizePhoto: string;
  };
  guardianInfo?: {
    guardianName: string;
    guardianContactNumber: string;
  };
}

const PlayerList = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState({
    playerId: '',
    fullName: '',
    dob: '',
    type: 'Men’s',
    nationality: '',
    contactNumber: '',
    email: '',
    password: '',
    teamAssignment: '',
    playerPosition: 'Forward',
    status: 'Pending',
  });

  // Fix: Explicitly typing selectedFields
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    playerId: true,
    fullName: true,
    type: true,
    nationality: true,
    playerPosition: true,
    contactNumber: true,
    status: true,
    guardianInfo: true,
    documents: true,
  });


useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/players');
        console.log(res.data); // Log data to ensure it's being fetched correctly
        if (res.status === 200) {
          setPlayers(res.data);
        } else {
          setError('Failed to fetch players');
        }
      } catch (error) {
        setError('Error fetching players');
        console.error(error); // Log any error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);


  const handleEditClick = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      playerId: player.playerId,
      fullName: player.fullName,
      dob: player.dob,
      type: player.type,
      nationality: player.nationality,
      contactNumber: player.contactNumber,
      email: player.email || '',
      password: player.password,
      teamAssignment: player.teamAssignment,
      playerPosition: player.playerPosition,
      status: player.status,
    });
  };

  const handleDeleteClick = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this player?');
    if (confirmDelete) {
      try {
        const res = await axios.delete(`/api/players/${id}`);
        if (res.status === 200) {
          setPlayers((prevPlayers) => prevPlayers.filter((player) => player._id !== id));
        } else {
          setError('Error deleting player');
        }
      } catch (error) {
        setError('Error deleting player');
        console.error(error); // Log any error for debugging
      }
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPlayer = {
      ...formData,
    };

    try {
      const res = await axios.put(`/api/players/${editingPlayer?._id}`, updatedPlayer, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        const updatedPlayerData = res.data;
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player._id === updatedPlayerData._id ? updatedPlayerData : player
          )
        );
        setEditingPlayer(null);
      } else {
        setError('Error updating player');
      }
    } catch (error) {
      setError('Error updating player');
      console.error(error); // Log any error for debugging
    }
  };
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleFieldSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSelectedFields((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleStatusChange = async (id: string, currentStatus: 'Pending' | 'Approved') => {
    const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
    
    try {
      const res = await axios.put(`/api/players/${id}`, { status: newStatus }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        const updatedPlayer = res.data;
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player._id === updatedPlayer._id ? updatedPlayer : player
          )
        );
      } else {
        setError('Error updating status');
      }
    } catch (error) {
      setError('Error updating status');
      console.error(error); // Log any error for debugging
    }
  };

  const generateCSV = () => {
    const headers = Object.keys(selectedFields).filter((field) => selectedFields[field]);
    const rows = players.map((player) =>
      headers.map((header) => {
        switch (header) {
          case 'playerId':
            return player.playerId;
          case 'fullName':
            return player.fullName;
          case 'type':
            return player.type;
          case 'nationality':
            return player.nationality;
          case 'playerPosition':
            return player.playerPosition;
          case 'contactNumber':
            return player.contactNumber;
          case 'status':
            return player.status;
          case 'guardianInfo':
            return player.guardianInfo
              ? `${player.guardianInfo.guardianName}, ${player.guardianInfo.guardianContactNumber}`
              : '';
          case 'documents':
            return player.documents.passportSizePhoto;
          default:
            return '';
        }
      })
    );

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach((row) => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'players.csv');
    link.click();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Field Selection for CSV Export */}
      <div className="mb-4">
        <h2>Select Fields to Export</h2>
        {Object.keys(selectedFields).map((field) => (
          <div key={field} className="flex items-center">
            <input
              type="checkbox"
              name={field}
              checked={selectedFields[field]}
              onChange={handleFieldSelection}
              className="mr-2"
            />
            <label>{field}</label>
          </div>
        ))}
        <button
          onClick={generateCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Generate CSV
        </button>
      </div>

      {/* Edit Form */}
      {editingPlayer && (
        <div className="p-4 bg-gray-100 rounded-lg mb-4">
          <h2>Edit Player</h2>
          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div>
              <label>Player ID:</label>
              <input
                type="text"
                name="playerId"
                value={formData.playerId}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              />
            </div>
            <div>
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              />
            </div>

            <div>
              <label>Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              >
                <option value="Men’s">Men’s</option>
                <option value="Youth’s">Youth’s</option>
                <option value="Women’s">Women’s</option>
              </select>
            </div>
            <div>
              <label>Nationality:</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              />
            </div>
            <div>
              <label>Contact Number:</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
              />
            </div>

            <div>
              <label>Player Position:</label>
              <select
                name="playerPosition"
                value={formData.playerPosition}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              >
                <option value="Forward">Forward</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Defender">Defender</option>
                <option value="Goalkeeper">Goalkeeper</option>
              </select>
            </div>
            <div>
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Player List Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Player ID</th>
            <th className="px-4 py-2 border">Full Name</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Nationality</th>
            <th className="px-4 py-2 border">Position</th>
            <th className="px-4 py-2 border">Contact Number</th>
            <th className="px-4 py-2 border">Age</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Guardian Info</th>
            <th className="px-4 py-2 border">Passport Photo</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player._id}>
              <td className="px-4 py-2 border">{player.playerId}</td>
              <td className="px-4 py-2 border">{player.fullName}</td>
              <td className="px-4 py-2 border">{player.type}</td>
              <td className="px-4 py-2 border">{player.nationality}</td>
              <td className="px-4 py-2 border">{player.playerPosition}</td>
              <td className="px-4 py-2 border">{player.contactNumber}</td>
              <td className="px-4 py-2 border">{calculateAge(player.dob)} years</td>
              <td className="px-4 py-2 border">
                <input
                  type="checkbox"
                  checked={player.status === 'Approved'}
                  onChange={() => handleStatusChange(player._id, player.status)}
                  className="mr-2"
                />
                {player.status}
              </td>
              <td className="px-4 py-2 border">
                {player.guardianInfo ? (
                  <div>
                    <p>{player.guardianInfo.guardianName}</p>
                    <p>{player.guardianInfo.guardianContactNumber}</p>
                  </div>
                ) : (
                  <p>No guardian info</p>
                )}
              </td>
              <td className="px-4 py-2 border">
                <a
                  href={player.documents.passportSizePhoto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Photo
                </a>
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEditClick(player)}
                  className="text-green-500 hover:underline"
                >
                  <FaEdit className="inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(player._id)}
                  className="text-red-500 hover:underline ml-2"
                >
                  <FaTrash className="inline mr-2" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerList;

