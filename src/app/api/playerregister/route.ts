import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/Player';
import Team from '@/models/Team';

export async function POST(req: NextRequest) {
  try {
    const playerData = await req.json(); // Parsing the request body
    await dbConnect();

    // Ensure passport size photo is provided
    const { birthCertificate, passportSizePhoto } = playerData.documents || {};
    if (!passportSizePhoto) {
      return NextResponse.json({ message: 'Passport size photo is required' }, { status: 400 });
    }

    // Check if the team exists
    const team = await Team.findById(playerData.teamAssignment);
    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }

    // Check if the team has reached the maximum number of players
    if (!team.canAddPlayer()) {
      return NextResponse.json({ message: 'Team has reached its player limit.' }, { status: 400 });
    }

    // Ensure playerId is set correctly
    if (!playerData.playerId) {
      playerData.playerId = 'P' + Math.floor(Math.random() * 1000000); // Generate playerId if not provided
    }

    // If guardianInfo is provided, include it in the player data
    const guardianInfo =
      playerData.guardianName && playerData.guardianContactNumber
        ? {
            guardianName: playerData.guardianName,
            guardianContactNumber: playerData.guardianContactNumber,
          }
        : undefined;

    // Create and save the new player
    const player = new Player({
      ...playerData,
      documents: {
        birthCertificate: birthCertificate || '', // Optional (set empty string if not provided)
        passportSizePhoto, // Required
      },
      guardianInfo, // Ensure guardianInfo is added
    });

    await player.save();

    // Add the player to the team's player list
    team.players.push(player._id);
    await team.save();

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json({ message: 'Error creating player', error }, { status: 500 });
  }
}
