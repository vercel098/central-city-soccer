import Image from 'next/image';
import { useEffect, useState } from 'react';

const GenerateQRCode = ({ playerId, teamId }: { playerId: string; teamId: string }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // Construct the URL with PlayerId and TeamId to pass to the PlayerProfile
    const playerProfileUrl = `${window.location.origin}/profileQrCode/${playerId}`;
    
    // Generate QR code URL using an API (QR Code Generator API)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(playerProfileUrl)}&size=256x256`;
    
    setQrCodeUrl(qrApiUrl); // Set the URL for the QR code
  }, [playerId, teamId]); // Only re-run effect if playerId or teamId changes

  return (
    <div>
      {/* Only render the Image component if qrCodeUrl is available */}
      {qrCodeUrl && (
        <Image src={qrCodeUrl} alt="QR Code" width={56} height={56} />
      )}
    </div>
  );
};

export default GenerateQRCode;
