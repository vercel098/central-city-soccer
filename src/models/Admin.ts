import mongoose, { Document, Schema } from 'mongoose';

// Create an interface for the Admin model
interface IAdmin extends Document {
  adminNumber: string;
  password: string;
}

// Define the schema for the Admin model
const adminSchema = new Schema<IAdmin>({
  adminNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Check if the model already exists in mongoose, to avoid overwriting it
const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
