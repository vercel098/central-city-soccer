import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import '../app/teamuserprofile/print.css';

// Define more specific types for Player and TeamData instead of using `any`
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
    passportSizePhoto?: string; // Optional passport photo
  };
  guardianInfo?: {
    guardianName: string;
    guardianContactNumber: string;
  };
  registrationDate: string;
}


interface TeamData {
  teamName: string;
}

interface PlayerCardProps {
  player: Player;
  teamData: TeamData;
}

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

// Print functionality
const handlePrint = (player: Player, teamData: TeamData, qrCodeUrl: string) => {
  const printContent = document.getElementById('printable-card');
  if (printContent) {
    const newWindow = window.open('', '', 'width=800, height=600');
    newWindow?.document.write(`
      <html>
        <head>
          <title>Print Player Card</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .printable-card { 
              width: 83mm; 
              height: 49mm; 
              border: 1px solid #ccc; 
              border-radius: 8px; 
              padding: 5px; 
              background-color: #0059A0;
              color: white;
              display: flex;
              justify-content: space-between;
            }
            .player-photo { margin-right: 10px; }
            .details { font-size: 10px; line-height: 1.5; }
            .qr-code { margin-top: 15px; }
            .card-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .left-photo, .right-photo {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .right-photo img {
              margin-left: 30px;
            }
            .image1 {
              width: 33mm; 
              height: 49mm; 
              border-radius: 8px;
            }
            .image2 {
              width: 33mm;
              height: 29mm;
              border-radius: 8px;
            }
            .text {
              margin-left: 10px;
              margin-top: 5px;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="printable-card">
            <div class="card-content">
              <div class="left-photo">
                <img
                  src="${player.documents?.passportSizePhoto || '/ccslcopy.jpg'}"
                  alt="Player Photo"
                  width="129"
                  height="45"
                  class="image1"
                />
              </div>

              <div class="right-photo">
                <img
                  src="/ccslcopy.jpg"
                  alt="Player Photo"
                  width="103"
                  height="45"
                  class="image2"
                />
                <div class="card-content">
                  <div class="text">
                    <div>${player.fullName}</div>
                    <div>${teamData.teamName}</div>
                    <div>${player.playerId}</div>
                    <div>${calculateAge(player.dob)} years</div>
                  </div>

                  <div class="qr-code">
                    <img src="${qrCodeUrl}" alt="QR Code" width="50" height="50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    newWindow?.document.close();
    newWindow?.print();
  }
};

const PlayerCard: React.FC<PlayerCardProps> = ({ player, teamData }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const playerProfileUrl = `${window.location.origin}/profileQrCode/${player.playerId}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(playerProfileUrl)}&size=256x256`;
    setQrCodeUrl(qrApiUrl); 
  }, [player.playerId, teamData.teamName]); 

  return (
    <div>
      <div className="w-[83mm] h-[49mm] border border-gray-300 rounded-lg p-1 printable bg-[#0059A0]" id="printable-card">
        <div className="flex-none w-[83mm] h-[49mm]">
          <div className="flex justify-between mr-1">
            <Image
              src={player.documents?.passportSizePhoto || '/ccslcopy.jpg'}
              alt="Player Photo"
              width={129}
              height={45}
              className="object-cover rounded-md shadow-md"
            />

            <div className="mr-2">
              <Image
                src="/ccslcopy.jpg"
                alt="Player Photo"
                width={103}
                height={45}
                className="object-cover rounded-md shadow-md ml-2"
              />
              <div className="flex">
                <div className="flex flex-col justify-between w-full">
                  <div className="text-white text-[10px] font-medium ml-2">
                    <div>{player.fullName}</div>
                    <div>{teamData.teamName}</div>
                    <div>{player.playerId}</div>
                    <div>{calculateAge(player.dob)} years</div>
                  </div>
                </div>
                <div className="mt-7">
                  {qrCodeUrl && <Image src={qrCodeUrl} alt="QR Code" width={56} height={56} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => handlePrint(player, teamData, qrCodeUrl)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
        Print Card
      </button>
    </div>
  );
};

export default PlayerCard;
