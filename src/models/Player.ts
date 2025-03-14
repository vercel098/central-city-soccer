import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IPlayer extends Document {
  playerId: string;
  fullName: string;
  dob: Date;
  type: 'Men’s' | 'Youth’s' | 'Women’s';
  nationality: string;
  contactNumber: string;
  email?: string;
  password: string; // Keeping password field
  teamAssignment: mongoose.Schema.Types.ObjectId; // Reference to the Team model
  playerPosition: 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
  documents: {
    birthCertificate: string;
    passportSizePhoto: string;
  };
  guardianInfo?: {
    guardianName: string;
    guardianContactNumber: string;
  };
  registrationDate: Date;
  status: 'Pending' | 'Approved';
}

// Create the Player schema without password hashing middleware
const PlayerSchema: Schema<IPlayer> = new mongoose.Schema(
  {
    playerId: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return 'P' + Math.floor(Math.random() * 1000000); // Example of generating a unique player ID
      }
    },
    fullName: {
      type: String,
      required: true
    },
    dob: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['Men’s', 'Youth’s', 'Women’s'],
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false,
      validate: {
        validator: function (v: string) {
          return /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(v);
        },
        message: (props: { value: string }) => `${props.value} is not a valid email!`
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length
    },
    teamAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team', // Referencing the Team model
      required: true
    },
    playerPosition: {
      type: String,
      enum: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
      required: true
    },
    documents: {
      birthCertificate: {
        type: String,  // Store file URL or path
        required: false
      },
      passportSizePhoto: {
        type: String,  // Store file URL or path
        required: true
      }
    },
    guardianInfo: {
      guardianName: {
        type: String,
        required: function (this: IPlayer) {
          return this.dob && this.dob > new Date();  // Only require if minor
        }
      },
      guardianContactNumber: {
        type: String,
        required: function (this: IPlayer) {
          return this.dob && this.dob > new Date();  // Only require if minor
        }
      }
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved'],
      default: 'Pending'
    }
  }
);

// Hash the password before saving the player
PlayerSchema.pre('save', async function (next) {
  // You no longer need to alias 'this' since it refers to the current player instance
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword; // Set the hashed password
  }

  next();
});


export default mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
