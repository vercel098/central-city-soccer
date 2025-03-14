import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/Team';

interface Params {
  id: string;
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const { id } = params; // Access id from params
  const { teamName, teamCategory, coachName, assistantCoachName, approvalStatus, teamLogo, maxPlayers } = await req.json(); // Get the team data from the request body

  try {
    // Connect to the database
    await dbConnect();

    // Find the team by ID and update the fields
    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      {
        teamName,
        teamCategory,
        coachName,
        assistantCoachName,
        approvalStatus,
        teamLogo,
        maxPlayers,
      },
      { new: true } // Return the updated document
    );

    if (!updatedTeam) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      );
    }

    // Return the updated team data
    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating team', error },
      { status: 500 }
    );
  }
}
