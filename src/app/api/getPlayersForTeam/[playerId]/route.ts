import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/Player';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use your secret key

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { teamId: string };
    await dbConnect();

    // Get playerId and updates from request body
    const { playerId, updates } = await req.json();

    // Find the player by playerId and teamAssignment (ensure teamId is valid)
    const player = await Player.findOneAndUpdate(
      { playerId, teamAssignment: decoded.teamId },
      updates, // Apply the updates
      { new: true } // Return the updated player document
    );

    if (!player) {
      return NextResponse.json({ message: 'Player not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ player }, { status: 200 });
  } catch (error) {
    console.error('Error updating player data:', error);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
