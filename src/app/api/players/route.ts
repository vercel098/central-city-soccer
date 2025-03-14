import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/Player';

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();
    
    // Fetch all players from the database and populate the "teamAssignment" reference
    const players = await Player.find().populate('teamAssignment'); // Assuming "teamAssignment" is referencing the Team model

    // Create the response and prevent caching
    const response = NextResponse.json(players, { status: 200 });
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching players', error },
      { status: 500 }
    );
  }
}
