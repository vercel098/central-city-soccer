import { NextResponse } from 'next/server'; // We can remove 'req' import since it's not used
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/Team';

export async function GET() { // Removed the 'req' parameter since it's not used
  try {
    await dbConnect();

    // Fetch all teams including the teamLogo
    const teams = await Team.find({}, 'teamName teamCategory coachName teamLogo'); // Ensure teamLogo is included

    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching teams', error },
      { status: 500 }
    );
  }
}
