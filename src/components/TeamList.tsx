"use client";

import { useState, useEffect } from 'react';
import { FaImage, FaEdit, FaTrash } from 'react-icons/fa';

interface Player {
  _id: string;
  name: string;
}

interface Team {
  _id: string;
  teamName: string;
  teamCategory: 'Men’s' | 'Youth’s' | 'Women’s';
  coachName: string;
  assistantCoachName: string;
  approvalStatus: 'Pending' | 'Approved';
  players: Player[]; // Replace any[] with Player[]
  teamLogo: string;
  maxPlayers: number;
}

// Define selectedFields type explicitly to support dynamic indexing
type SelectedFields = Record<string, boolean>;

const TeamList = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    teamName: '',
    teamCategory: 'Men’s',
    coachName: '',
    assistantCoachName: '',
    approvalStatus: 'Pending',
    teamLogo: '',
    maxPlayers: 0,
  });
  const [selectedFields, setSelectedFields] = useState<SelectedFields>({
    teamName: true,
    teamCategory: true,
    coachName: true,
    assistantCoachName: true,
    approvalStatus: true,
    teamLogo: true,
    players: true,
    maxPlayers: true,
  });

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/teams', {
          method: 'GET', // Explicitly specifying GET method
          
        });
  
        const data = await res.json();
        if (res.status === 200) {
          setTeams(data);
        } else {
          setError('Failed to fetch teams');
        }
      } catch {
        setError('Error fetching teams');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTeams();
  }, []);
  

  const handleApprovalChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
    
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvalStatus: newStatus }),
      });

      if (res.status === 200) {
        const updatedTeam = await res.json();
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team._id === updatedTeam._id ? updatedTeam : team
          )
        );
      } else {
        setError('Error updating approval status');
      }
    } catch {
      setError('Error updating approval status');
    }
  };

  const handleEditClick = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      teamName: team.teamName,
      teamCategory: team.teamCategory,
      coachName: team.coachName,
      assistantCoachName: team.assistantCoachName,
      approvalStatus: team.approvalStatus,
      teamLogo: team.teamLogo,
      maxPlayers: team.maxPlayers,
    });
  };

  const handleDeleteClick = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this team?');
    if (confirmDelete) {
      try {
        const res = await fetch(`/api/teams/${id}`, {
          method: 'DELETE',
        });

        if (res.status === 200) {
          setTeams((prevTeams) => prevTeams.filter((team) => team._id !== id));
        } else {
          setError('Error deleting team');
        }
      } catch {
        setError('Error deleting team');
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

    const updatedTeam = {
      ...formData,
    };

    try {
      const res = await fetch(`/api/teams/edit/${editingTeam?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeam),
      });

      if (res.status === 200) {
        const updatedTeamData = await res.json();
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team._id === updatedTeamData._id ? updatedTeamData : team
          )
        );
        setEditingTeam(null);
      } else {
        setError('Error updating team');
      }
    } catch {
      setError('Error updating team');
    }
  };

  const handleFieldSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSelectedFields((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const generateCSV = () => {
    const headers = Object.keys(selectedFields).filter((field) => selectedFields[field]);
    const rows = teams.map((team) =>
      headers.map((header) => {
        switch (header) {
          case 'teamName':
            return team.teamName;
          case 'teamCategory':
            return team.teamCategory;
          case 'coachName':
            return team.coachName;
          case 'assistantCoachName':
            return team.assistantCoachName;
          case 'approvalStatus':
            return team.approvalStatus;
          case 'teamLogo':
            return team.teamLogo;
          case 'players':
            return team.players.length;
          case 'maxPlayers':
            return team.maxPlayers;
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
    link.setAttribute('download', 'teams.csv');
    link.click();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="mb-4">
        <h2>Select Fields to Export</h2>
        {Object.keys(selectedFields).map((field) => (
          <div key={field} className="flex items-center">
            <input
              type="checkbox"
              name={field}
              checked={selectedFields[field]}
              onChange={handleFieldSelection}
              className="mr-2 "
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
      {editingTeam && (
        <div className="p-4 bg-gray-100 rounded-lg mb-4">
          <h2>Edit Team</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label>Team Name:</label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              />
            </div>
            <div>
              <label>Category:</label>
              <select
                name="teamCategory"
                value={formData.teamCategory}
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
              <label>Coach Name:</label>
              <input
                type="text"
                name="coachName"
                value={formData.coachName}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              />
            </div>
            <div>
              <label>Assistant Coach Name:</label>
              <input
                type="text"
                name="assistantCoachName"
                value={formData.assistantCoachName}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              />
            </div>
            <div>
              <label>Approval Status:</label>
              <select
                name="approvalStatus"
                value={formData.approvalStatus}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
            <div>
              <label>Max Players:</label>
              <input
                type="number"
                name="maxPlayers"
                value={formData.maxPlayers}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Team List Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 ">
            {selectedFields.teamName && <th className="px-4 py-2 border">Team Name</th>}
            {selectedFields.teamCategory && <th className="px-4 py-2 border">Category</th>}
            {selectedFields.coachName && <th className="px-4 py-2 border">Coach</th>}
            {selectedFields.assistantCoachName && <th className="px-4 py-2 border">Assistant Coach</th>}
            {selectedFields.approvalStatus && <th className="px-4 py-2 border">Approval Status</th>}
            {selectedFields.teamLogo && <th className="px-4 py-2 border">Logo</th>}
            {selectedFields.players && <th className="px-4 py-2 border">Players</th>}
            {selectedFields.maxPlayers && <th className="px-4 py-2 border">Max Players</th>}
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team._id}>
              {selectedFields.teamName && <td className="px-4 py-2 border">{team.teamName}</td>}
              {selectedFields.teamCategory && <td className="px-4 py-2 border">{team.teamCategory}</td>}
              {selectedFields.coachName && <td className="px-4 py-2 border">{team.coachName}</td>}
              {selectedFields.assistantCoachName && <td className="px-4 py-2 border">{team.assistantCoachName}</td>}
              {selectedFields.approvalStatus && (
                <td className="px-4 py-2 border">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={team.approvalStatus === 'Approved'}
                      onChange={() =>
                        handleApprovalChange(team._id, team.approvalStatus)
                      }
                      className="mr-2"
                    />
                    {team.approvalStatus}
                  </label>
                </td>
              )}
              {selectedFields.teamLogo && (
                <td className="px-4 py-2 border">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => window.open(team.teamLogo, '_blank')}
                  >
                    <FaImage className="inline mr-2" />
                    View Logo
                  </button>
                </td>
              )}
              {selectedFields.players && <td className="px-4 py-2 border">{team.players.length}</td>}
              {selectedFields.maxPlayers && <td className="px-4 py-2 border">{team.maxPlayers}</td>}
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEditClick(team)}
                  className="text-green-500 hover:underline"
                >
                  <FaEdit className="inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(team._id)}
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


export default TeamList;
