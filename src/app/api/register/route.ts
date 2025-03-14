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
    // Check if the admin number already exists
    const existingAdmin = await Admin.findOne({ adminNumber });
    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin number already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin document
    const newAdmin = new Admin({
      adminNumber,
      password: hashedPassword,
    });

    // Save the new admin to the database
    await newAdmin.save();

    return NextResponse.json({ message: 'Admin registered successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}
