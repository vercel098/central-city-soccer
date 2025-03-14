"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PlayerEditModal from "@/components/Modal/PlayerEditModal";
import Navbar2 from "@/components/Navbar2";


interface PlayerData {
  fullName: string;
  contactNumber: string;
  nationality: string;
  guardianName: string;
  guardianContactNumber: string;
  birthCertificate: string;
  passportSizePhoto: string;
}

// Define interfaces for the player and team data
interface Player {
  fullName: string;
  playerId: string;
  dob: string;
  nationality: string;
  status: string;
  contactNumber: string;
  playerPosition: string;
  documents: {
    passportSizePhoto: string;
    birthCertificate: string;
  };
  teamAssignment: string | null;
  guardianInfo?: {
    guardianName: string;
    guardianContactNumber: string;
  };
}

interface Team {
  teamLogo: string;
  teamName: string;
  teamCategory: string;
  coachName: string;
  assistantCoachName: string;
  maxPlayers: number;
  players: Player[]; // Define players as an array of Player type
}

export default function UserProfile() {
  const [player, setPlayer] = useState<Player | null>(null); // State for player data
  const [team, setTeam] = useState<Team | null>(null);  // State for team data
  const [error, setError] = useState<string | null>(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [, setPlayerData] = useState<Player | null>(null); // State for player data in modal
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null); // Full-screen image state
  const router = useRouter();

  useEffect(() => {
    const fetchProfileAndTeam = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/playerlogin"); // Redirect to login if no token
          return;
        }

        const response = await fetch("/api/playerprofile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPlayer(data);

          // Fetch team information using the teamAssignment reference
          if (data.teamAssignment) {
            const teamResponse = await fetch(`/api/team/${data.teamAssignment}`);
            if (teamResponse.ok) {
              const teamData = await teamResponse.json();
              setTeam(teamData);  // Set team data in the state
            } else {
              setError("Failed to load team information");
            }
          }
        } else {
          const data = await response.json();
          setError(data.message || "Failed to load profile");
        }
      } catch {
        setError("An error occurred while fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndTeam();
  }, [router]);

  const openModal = () => {
    setShowModal(true);
    setPlayerData(player);  // Pre-fill the modal with current player data
  };

  const closeModal = () => {
    setShowModal(false);
    setFullScreenImage(null);  // Close full-screen image when modal is closed
  };

  const handleEdit = async (updatedPlayerData: PlayerData) => {  // Updated to PlayerData
    setLoading(true);
    try {
      const response = await fetch("/api/playerupdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedPlayerData,
          playerId: player?.playerId, // Include additional required fields
          dob: player?.dob,
          status: player?.status,
          playerPosition: player?.playerPosition,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setPlayer((prevState: Player | null) => ({
          ...prevState,
          ...data,
        }));
        closeModal();
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch {
      setError("An error occurred while updating the profile");
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleImageClick = (imageUrl: string) => {
    setFullScreenImage(imageUrl); // Open the image in full-screen
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    router.push("/"); // Redirect to the home page or login page
  };

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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div>
      <Navbar2 />

      <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-[#0E1AC6]">Player Profile</h2>
          <p className="text-lg text-[#0E1AC6]">Here’s a summary of your profile information</p>
        </div>

        {player && (
          <div className="space-y-8">
            {/* Profile Picture Section */}
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40 cursor-pointer">
                <Image
                  src={player.documents.passportSizePhoto} // Assuming passport size photo is a URL
                  alt="Player Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full shadow-lg"
                  onClick={() => handleImageClick(player.documents.passportSizePhoto)} // Handle click to open full screen
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Personal Information Section */}
              <div className="p-8 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#0E1AC6] mb-5">Personal Information</h3>
                <div className="space-y-4 text-lg">
                  <div>
                    <strong className="font-medium text-[#0E1AC6]">Full Name:</strong> {player.fullName}
                  </div>
                  <div>
                    <strong className="font-medium text-[#0E1AC6]">Player ID:</strong> {player.playerId}
                  </div>
                  <div><strong className="font-medium text-[#0E1AC6]">Age:</strong> {calculateAge(player.dob)} years</div>
                  <div><strong className="font-medium text-[#0E1AC6]">Nationality:</strong> {player.nationality}</div>
                  <div>
                    <strong className="font-medium text-[#0E1AC6]">Status:</strong> {player.status}
                  </div>
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="p-8 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#0E1AC6] mb-5">Contact Details</h3>
                <div className="space-y-4 text-lg">
                  <div>
                    <strong className="font-medium text-[#0E1AC6]">Contact Number:</strong>{" "}
                    {player.contactNumber}
                  </div>
                  <div>
                    <strong className="font-medium text-[#0E1AC6]">Player Position:</strong>{" "}
                    {player.playerPosition}
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian Info Section */}
            {player.guardianInfo && (
              <div className="p-8 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#0E1AC6] mb-5">Guardian Information</h3>
                <div className="space-y-4 text-lg">
                  <div>
                    <strong className="font-medium text-[#0E1AC6]">Guardian Name:</strong> {player.guardianInfo.guardianName}
                  </div>
                  <div>
                    <strong className="font-medium text-[#0E1AC6]">Guardian Contact Number:</strong> {player.guardianInfo.guardianContactNumber}
                  </div>
                </div>
              </div>
            )}

            {/* Team Info Section */}
            {team && (
              <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-2xl font-semibold text-[#0E1AC6] mb-5">Team Information</h3>
                <div className="flex justify-center mt-4">
                  <div className="w-36 h-36">
                    <Image
                      src={team.teamLogo}
                      alt="Team Logo"
                      width={144}  // Width (36 * 4 for responsive)
                      height={144} // Height (36 * 4 for responsive)
                      objectFit="contain"
                      className="rounded-full shadow-md"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-medium text-[#0E1AC6]">Team Name:</span>
                    <p className="text-lg text-gray-600">{team.teamName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-medium text-[#0E1AC6]">Team Category:</span>
                    <p className="text-lg text-gray-600">{team.teamCategory}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-medium text-[#0E1AC6]">Coach Name:</span>
                    <p className="text-lg text-gray-600">{team.coachName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-medium text-[#0E1AC6]">Assistant Coach:</span>
                    <p className="text-lg text-gray-600">{team.assistantCoachName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-medium text-[#0E1AC6]">Max Players:</span>
                    <p className="text-lg text-gray-600">{team.maxPlayers}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-medium text-[#0E1AC6]">Available Sits:</span>
                    <p className="text-lg text-gray-600">
                      {team.maxPlayers - (team.players.length || 0)} {/* Calculate the available spots */}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Section */}
            <div className="p-8 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#0E1AC6] mb-5">Documents</h3>
              <ul className="space-y-4 text-lg">
                <li>
                  <strong className="font-medium text-[#0E1AC6]">Birth Certificate:</strong>{" "}
                  {player.documents.birthCertificate.includes("http") ? (
                    <Image
                      src={player.documents.birthCertificate} // Assuming the URL points to an image
                      alt="Birth Certificate"
                      width={200}  // You can adjust the width as needed
                      height={200} // Adjust the height as needed
                      className="rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(player.documents.birthCertificate)} // Handle click to open full screen
                    />
                  ) : (
                    player.documents.birthCertificate // If it's not a URL, just display the text
                  )}
                </li>
              </ul>
            </div>

            {/* Edit Profile Button */}
            <div className="text-center mt-10">
              <button
                onClick={openModal}  // Open the modal when clicked
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        {/* Full-Screen Image Modal */}
        {fullScreenImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <Image
              src={fullScreenImage}
              alt="Full Screen"
              width={600}
              height={600}
              className="rounded-lg"
            />
          </div>
        )}

{showModal && player && (
  <PlayerEditModal
    closeModal={closeModal}
    playerData={{
      fullName: player.fullName,
      contactNumber: player.contactNumber,
      nationality: player.nationality,
      guardianName: player.guardianInfo?.guardianName || "",
      guardianContactNumber: player.guardianInfo?.guardianContactNumber || "",
      birthCertificate: player.documents.birthCertificate,
      passportSizePhoto: player.documents.passportSizePhoto,
    }}
    handleEdit={handleEdit}
  />
)}

      </div>
    </div>
  );
}
