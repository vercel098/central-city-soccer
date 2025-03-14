import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/Player';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use your secret key

// Define a specific type for the params
interface Params {
  playerId: string;
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const { playerId } = await params; // Await params before accessing playerId

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { teamId: string };
    await dbConnect();

    // Update the player status to "Approved"
    const player = await Player.findOneAndUpdate(
      { playerId, teamAssignment: decoded.teamId }, // Query by playerId instead of _id
      { status: 'Approved' }, // Update status to Approved
      { new: true } // Return the updated player document
    );

    if (!player) {
      return NextResponse.json({ message: 'Player not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ player }, { status: 200 });
  } catch (error) {
    console.error('Error in approvePlayer request:', error);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { playerId } = await params; // Await params before accessing playerId

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { teamId: string };
    await dbConnect();

    // Delete the player
    const player = await Player.findOneAndDelete({
      playerId,
      teamAssignment: decoded.teamId,
    });

    if (!player) {
      return NextResponse.json({ message: 'Player not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Player deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in deletePlayer request:', error);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
