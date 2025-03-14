import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // Import bcrypt for password comparison
import jwt from 'jsonwebtoken'; // For generating JWT token
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/Team';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // You should set this secret in your environment

export async function POST(req: NextRequest) {
  try {
    const { teamName, password } = await req.json();

    await dbConnect();

    // Find the team by teamName
    const team = await Team.findOne({ teamName });

    if (!team) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      );
    }

    // Compare the password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, team.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Incorrect password' },
        { status: 400 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign({ teamId: team._id, teamName: team.teamName }, JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    return NextResponse.json(
      { message: 'Login successful', token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error logging in', error },
      { status: 500 }
    );
  }
}
