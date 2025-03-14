import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Player from '@/models/Player';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(req: Request) {
  const { playerId, password } = await req.json();

  try {
    // Ensure the database is connected
    await dbConnect();

    // Find the player by playerId
    const player = await Player.findOne({ playerId });

    if (!player) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    // Log the password from request and the hashed password stored in the database for debugging
    console.log('Player entered password:', password);
    console.log('Stored password hash:', player.password);

    // Check if the password is correct by comparing the plaintext password with the hashed one
    const isMatch = await bcrypt.compare(password, player.password);

    if (!isMatch) {
      console.error('Password mismatch');
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { playerId: player.playerId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Respond with the token
    return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
