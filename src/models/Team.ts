import mongoose, { Document, Schema } from 'mongoose';

interface ITeam extends Document {
  teamName: string;
  teamCategory: 'Men’s' | 'Youth’s' | 'Women’s';
  coachName: string;
  assistantCoachName: string;
  teamLogo: string;
  maxPlayers: number;
  players: mongoose.Schema.Types.ObjectId[];
  password: string; // Added password field
  approvalStatus: 'Pending' | 'Approved'; // New field for team approval status
}

const TeamSchema: Schema<ITeam> = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      unique: true,  // Ensuring the team name is unique
    },
    teamCategory: {
      type: String,
      enum: ['Men’s', 'Youth’s', 'Women’s'],
      required: true,
    },
    coachName: {
      type: String,
      required: true,
    },
    assistantCoachName: {
      type: String,
      required: true,
    },
    teamLogo: {
      type: String,  // Store file URL or path
      required: true,
    },
    maxPlayers: {
      type: Number,
      required: true,  // Now it's required and must be provided by the user
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      }
    ],
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length
    },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved'],
      default: 'Pending', // Default is 'Pending'
    },
  },
  {
    timestamps: true,
  }
);

// Custom method to check if a team has reached its player limit
TeamSchema.methods.canAddPlayer = function () {
  return this.players.length < this.maxPlayers;
};

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
