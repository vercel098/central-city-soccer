"use client";
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import eye icons from react-icons
import Toast from './Toast/Toast';
import { useRouter } from 'next/navigation';  // Import useRouter hook

export default function TeamRegistrationForm() {
  const [teamData, setTeamData] = useState({
    teamName: '',
    teamCategory: 'Men’s',
    coachName: '',
    assistantCoachName: '',
    teamLogo: null as File | null,  // Allowing teamLogo to be null or File
    maxPlayers: 0,
    password: '',  // Added password field
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const router = useRouter(); // Initialize useRouter

  // Handle changes in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
  };

  // Handle file changes for team logo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      setTeamData({ ...teamData, teamLogo: files[0] });
    }
  };

  const uploadToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append('files', file);
  
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  
    if (response.ok) {
      const result = await response.json();
      return result.urls[0]; // Return the uploaded URL from the response
    } else {
      throw new Error('Logo upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    if (teamData.password.length < 6) {
      setToast({ type: "error", message: "Password must be at least 6 characters long." });
      setLoading(false);
      return;
    }
  
    try {
      // Upload the logo
      const teamLogoUrl = await uploadToS3(teamData.teamLogo!);
  
      // Prepare the team data with the logo URL and password
      const updatedTeamData = { ...teamData, teamLogo: teamLogoUrl };
  
      const response = await fetch('/api/teamregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeamData),  // Ensure the password is part of this data
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setToast({ type: "success", message: "Team Registered Successfully!" });
        // Redirect to player login page after successful registration
        router.push('/teamLoginForm');
      } else {
        setToast({ type: "error", message: data.message });
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setToast({ type: "error", message: "Error creating team" });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Team Registration</h2>
       {/* Toast Notification */}
       {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Team Name and Category */}
        <div className="flex space-x-4">
          <div className="w-full">
            <label htmlFor="teamName" className="block text-sm font-medium text-[#0E1AC6]">Team Name</label>
            <input
              type="text"
              name="teamName"
              id="teamName"
              value={teamData.teamName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-full">
            <label htmlFor="teamCategory" className="block text-sm font-medium text-[#0E1AC6]">Team Category</label>
            <select
              name="teamCategory"
              id="teamCategory"
              value={teamData.teamCategory}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Men’s">Men’s</option>
              <option value="Youth’s">Youth’s</option>
              <option value="Women’s">Women’s</option>
            </select>
          </div>
        </div>

        {/* Coach and Assistant Coach */}
        <div className="flex space-x-4">
          <div className="w-full">
            <label htmlFor="coachName" className="block text-sm font-medium text-[#0E1AC6]">Coach Name</label>
            <input
              type="text"
              name="coachName"
              id="coachName"
              value={teamData.coachName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-full">
            <label htmlFor="assistantCoachName" className="block text-sm font-medium text-[#0E1AC6]">Assistant Coach Name</label>
            <input
              type="text"
              name="assistantCoachName"
              id="assistantCoachName"
              value={teamData.assistantCoachName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Team Logo */}
        <div className="w-full">
          <label htmlFor="teamLogo" className="block text-sm font-medium text-[#0E1AC6]">Team Logo</label>
          <input
            type="file"
            name="teamLogo"
            id="teamLogo"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Max Players */}
        <div className="w-full">
          <label htmlFor="maxPlayers" className="block text-sm font-medium text-[#0E1AC6]">Max Players</label>
          <input
            type="number"
            name="maxPlayers"
            id="maxPlayers"
            value={teamData.maxPlayers}
            onChange={handleChange}
            required
            min="1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <label htmlFor="password" className="block text-sm font-medium text-[#0E1AC6]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}  // Toggle between text and password
              name="password"
              id="password"
              value={teamData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}  // Toggle password visibility
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#0E1AC6]"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}  {/* Toggle eye icon */}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0E1AC6] font-bold text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Registering...' : 'Register Team'}
          </button>
        </div>
      </form>
    </div>
  );
}
