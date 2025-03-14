import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/Team';

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all teams from the database
    const teams = await Team.find().populate('players'); // Populate players if needed

    // Return the teams as a JSON response
    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    // Return an error response in case of failure
    return NextResponse.json(
      { message: 'Error fetching teams', error },
      { status: 500 }
    );
  }
}
