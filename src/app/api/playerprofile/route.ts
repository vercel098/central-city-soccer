import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/Player'; // Player model

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Secure your secret key

interface DecodedToken extends JwtPayload {
  playerId: string; // Declare playerId explicitly in the decoded JWT payload
}

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }

  try {
    // Decode and verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken; // Cast the decoded object to the DecodedToken type

    const playerId = decoded.playerId; // Now TypeScript knows decoded has playerId

    // Connect to the database
    await dbConnect();

    // Fetch player data from the database, including guardianInfo, but excluding the password
    const player = await Player.findOne({ playerId }).select('-password'); // Exclude password from the response

    if (!player) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    const response = NextResponse.json(player, { status: 200 });



    return response;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
