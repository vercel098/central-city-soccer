import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/Player';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use your secret key

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { teamId: string };
    await dbConnect();

    const players = await Player.find({ teamAssignment: decoded.teamId }).select(
      'fullName playerPosition dob nationality contactNumber email playerId documents registrationDate status guardianInfo type'
    );

    if (players.length === 0) {
      return NextResponse.json({ message: 'No players found' }, { status: 404 });
    }

    const formattedPlayers = players.map((player) => ({
      ...player.toObject(),
      dob: new Date(player.dob).toLocaleDateString(),
      registrationDate: new Date(player.registrationDate).toLocaleDateString(),
    }));

    const response = NextResponse.json({ players: formattedPlayers }, { status: 200 });

   

    return response;
  } catch {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { teamId: string };
    await dbConnect();

    const { playerId, updates } = await req.json();

    const player = await Player.findOneAndUpdate(
      { _id: playerId, teamAssignment: decoded.teamId },
      updates,
      { new: true } // Return the updated document
    );

    if (!player) {
      return NextResponse.json({ message: 'Player not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ player }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
