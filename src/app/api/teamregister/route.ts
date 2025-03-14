import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/Team';
import bcrypt from 'bcryptjs'; // For hashing the password

export async function POST(req: NextRequest) {
  try {
    const teamData = await req.json(); // Parsing the request body
    await dbConnect();

    // Validate if the maxPlayers field is provided
    if (!teamData.maxPlayers || teamData.maxPlayers <= 0) {
      return NextResponse.json(
        { message: 'maxPlayers field is required and should be greater than 0.' },
        { status: 400 }
      );
    }

    // Check if the team name already exists
    const existingTeam = await Team.findOne({ teamName: teamData.teamName });
    if (existingTeam) {
      return NextResponse.json(
        { message: 'Team with this name already exists.' },
        { status: 400 }
      );
    }

    // Check if password is provided and meets the minimum length
    if (!teamData.password || teamData.password.length < 6) {
      return NextResponse.json(
        { message: 'Password is required and must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(teamData.password, 10);
    teamData.password = hashedPassword;

    // Initialize the players array if no players are provided
    if (!teamData.players) {
      teamData.players = [];
    }

    // Set the approvalStatus to 'Pending' by default
    teamData.approvalStatus = 'Pending';  // New field to track the approval status

    // Create and save the new team with maxPlayers, hashed password, and approvalStatus
    const team = new Team(teamData);
    await team.save();

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating team', error },
      { status: 500 }
    );
  }
}
