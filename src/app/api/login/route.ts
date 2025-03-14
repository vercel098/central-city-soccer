import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import Admin from '@/models/Admin';
import connectMongo from '@/lib/dbConnect';

// Named export for POST method
export async function POST(req: NextRequest) {
  const { adminNumber, password } = await req.json(); // Parse JSON request body

  // Ensure the database connection
  await connectMongo();

  try {
    // Check if the admin number exists
    const admin = await Admin.findOne({ adminNumber });
    if (!admin) {
      return NextResponse.json({ message: 'Invalid admin number or password' }, { status: 400 });
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid admin number or password' }, { status: 400 });
    }

    // Return success response
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}
