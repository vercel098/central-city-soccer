export interface Player {
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
  