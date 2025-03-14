"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Toast from './Toast/Toast';
import { useRouter } from 'next/navigation';  // Import useRouter hook
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
interface Team {
  _id: string;
  teamName: string;
  teamLogo: string;
}

export default function PlayerRegistrationForm() {
  const [playerData, setPlayerData] = useState({
    playerId: '',  // Optional (Will be auto-generated)
    fullName: '',
    dob: '',
    type: 'Men’s',
    nationality: '',
    contactNumber: '',
    email: '',
    password: '', // Add password field
    teamAssignment: '',
    playerPosition: 'Forward',
    birthCertificate: null,
    passportSizePhoto: null,
    guardianName: '',
    guardianContactNumber: '',
    registrationDate: new Date().toISOString().split('T')[0],  // Default to today's date
    status: 'Pending',
  });

  const [teams, setTeams] = useState<Team[]>([]); // Specify the type of teams
  const [loading, setLoading] = useState(false); // Use loading for form submission state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // Add a state for password visibility
  const router = useRouter(); // Initialize useRouter

  // Define the function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teamsget');
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlayerData({ ...playerData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setPlayerData({ ...playerData, [name]: files[0] });
    }
  };

  const handleTeamSelect = (teamId: string) => {
    setPlayerData({ ...playerData, teamAssignment: teamId });
    setIsDropdownOpen(false);
  };

  const uploadToS3 = async (file: File) => { // Removed the unused '_key' parameter
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return result.urls[0]; // Assuming the response contains the URL in the "urls" array
    } else {
      throw new Error('File upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Set loading to true when form submission starts
    setLoading(true);

    try {
      // Upload birth certificate and passport photo to S3
      let birthCertificateUrl = "";
      if (playerData.birthCertificate) { // Upload only if a file is selected
        birthCertificateUrl = await uploadToS3(playerData.birthCertificate);
      }



      const passportSizePhotoUrl = await uploadToS3(playerData.passportSizePhoto!);

      // Prepare player data with document URLs
      const updatedPlayerData = {
        ...playerData,
        documents: {
          birthCertificate: birthCertificateUrl,
          passportSizePhoto: passportSizePhotoUrl,
        },
      };

      const response = await fetch('/api/playerregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPlayerData),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ type: "success", message: "Player Registered Successfully!" });
        // Redirect to player login page after successful registration
        router.push('/playerlogin');
      } else {
        setToast({ type: "error", message: data.message });
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setToast({ type: "error", message: "Error creating Player" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6 text-[#0E1AC6]">Player Registration</h2>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name and Date of Birth */}
        <div className="flex space-x-4">
          <div className="w-full">
            <label htmlFor="fullName" className="block text-sm font-medium text-[#0E1AC6]">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={playerData.fullName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-full">
            <label htmlFor="dob" className="block text-sm font-medium text-[#0E1AC6]">Date of Birth</label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={playerData.dob}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Nationality and Contact Number */}
        <div className="flex space-x-4">
          <div className="w-full">
            <label htmlFor="nationality" className="block text-sm font-medium text-[#0E1AC6]">Nationality</label>
            <input
              type="text"
              name="nationality"
              id="nationality"
              value={playerData.nationality}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-full">
            <label htmlFor="contactNumber" className="block text-sm font-medium text-[#0E1AC6]">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              id="contactNumber"
              value={playerData.contactNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="w-full">
          <label htmlFor="email" className="block text-sm font-medium text-[#0E1AC6]">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={playerData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Custom Team Dropdown */}
        <div className="w-full">
          <label htmlFor="teamAssignment" className="block text-sm font-medium text-[#0E1AC6]">Team</label>
          <div
            className="relative"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <button
              type="button"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {playerData.teamAssignment
                ? teams.find((team) => team._id === playerData.teamAssignment)?.teamName
                : 'Select a team'}
            </button>
            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 z-10">
                {loading ? (
                  <li className="px-3 py-2">Loading teams...</li>
                ) : (
                  teams.map((team) => (
                    <li
                      key={team._id}
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-indigo-100 text-[#0E1AC6]"
                      onClick={() => handleTeamSelect(team._id)}
                    >
                      <Image
                        src={team.teamLogo}
                        alt={team.teamName}
                        width={24}
                        height={24}
                        className="rounded-full mr-2"
                      />
                      {team.teamName}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
        {/* Player Type */}
        <div className="w-full">
          <label htmlFor="type" className="block text-sm font-medium text-[#0E1AC6]">Player Type</label>
          <select
            name="type"
            id="type"
            value={playerData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Men’s">Men’s</option>
            <option value="Youth’s">Youth’s</option>
            <option value="Women’s">Women’s</option>
          </select>
        </div>

        {/* Player Position */}
        <div className="space-y-4">
          <div className="w-full">
            <label htmlFor="playerPosition" className="block text-sm font-medium text-[#0E1AC6]">Player Position</label>
            <select
              name="playerPosition"
              id="playerPosition"
              value={playerData.playerPosition}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Forward">Forward</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Defender">Defender</option>
              <option value="Goalkeeper">Goalkeeper</option>
            </select>
          </div>
        </div>
        <div className="w-full relative">
          <label htmlFor="password" className="block text-sm font-medium text-[#0E1AC6]">Password</label>
          <input
            type={passwordVisible ? 'text' : 'password'} // Toggle the input type based on the visibility state
            name="password"
            id="password"
            value={playerData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility} // Toggle password visibility
            className="absolute right-3 top-[45px] transform -translate-y-1/2 text-[#0E1AC6] hover:text-indigo-600 focus:outline-none"
          >
            {passwordVisible ? (
              <AiOutlineEyeInvisible className="h-5 w-5" />
            ) : (
              <AiOutlineEye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* File Upload for Birth Certificate and Passport Size Photo */}
        <div className="space-y-4">
          <div className="w-full">
            <label htmlFor="birthCertificate" className="block text-sm font-medium text-[#0E1AC6]">Birth Certificate (Optional)</label>
            <input
              type="file"
              name="birthCertificate"
              id="birthCertificate"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-full">
            <label htmlFor="passportSizePhoto" className="block text-sm font-medium text-[#0E1AC6]">Passport Size Photo</label>
            <input
              type="file"
              name="passportSizePhoto"
              id="passportSizePhoto"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Guardian Information */}
        <div className="space-y-4">
          <div className="w-full">
            <label htmlFor="guardianName" className="block text-sm font-medium text-[#0E1AC6]">Guardian Name</label>
            <input
              type="text"
              name="guardianName"
              id="guardianName"
              value={playerData.guardianName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-full">
            <label htmlFor="guardianContactNumber" className="block text-sm font-medium text-[#0E1AC6]">Guardian Contact Number</label>
            <input
              type="text"
              name="guardianContactNumber"
              id="guardianContactNumber"
              value={playerData.guardianContactNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full">
          <button
            type="submit"
            className="w-full bg-[#0E1AC6] font-bold text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Registering...' : 'Register Player'}
          </button>
        </div>

      </form>
    </div>
  );
}
