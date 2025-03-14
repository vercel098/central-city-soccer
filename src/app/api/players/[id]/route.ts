import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/Player';

interface Context {
  params: {
    id: string;
  };
}

export async function PUT(req: NextRequest, context: Context) {
  const { id } = context.params; // Directly access the id from params
  const { fullName, dob, type, nationality, contactNumber, email, password, teamAssignment, playerPosition, documents, guardianInfo, status } = await req.json();

  try {
    await dbConnect();

    // Update the player by ID
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      {
        fullName,
        dob,
        type,
        nationality,
        contactNumber,
        email,
        password,
        teamAssignment,
        playerPosition,
        documents,
        guardianInfo,
        status,
      },
      { new: true }
    );

    if (!updatedPlayer) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPlayer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating player', error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const { id } = context.params; // Access id from params

  try {
    await dbConnect();
    
    // Delete the player by ID
    const deletedPlayer = await Player.findByIdAndDelete(id);

    if (!deletedPlayer) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Player deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting player', error }, { status: 500 });
  }
}
