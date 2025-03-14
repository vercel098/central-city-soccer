import { NextRequest, NextResponse } from "next/server";
import Team from "@/models/Team"; // Ensure this is the correct path for your Team model

// Handle GET request for fetching team data by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;  // Await the params object before using it

  try {
    // Find the team by ID
    const team = await Team.findById(id).populate("players");  // Populate players if necessary

    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: (error as Error).message }, { status: 500 });
  }
}
