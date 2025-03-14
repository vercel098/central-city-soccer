import { NextRequest, NextResponse } from "next/server";
import Team from "@/models/Team"; // Ensure this is the correct path for your Team model

// Handle GET request for fetching team data by teamName
export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  const { name } = params;  // Access the `name` from the params object

  try {
    // Find the team by teamName
    const team = await Team.findOne({ teamName: name }).populate("players"); // Populate players if necessary

    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: (error as Error).message }, { status: 500 });
  }
}
