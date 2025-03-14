import { NextRequest, NextResponse } from "next/server";
import Player from "@/models/Player"; // Ensure this path is correct

export async function GET(req: NextRequest, { params }: { params: { playerId: string } }) {
  try {
    const { playerId } = params;  // Directly access params (no need to await)

    console.log("Fetching player with ID:", playerId);  // Log the playerId to verify it's received

    // Find the player by playerId
    const player = await Player.findOne({ playerId });
    if (!player) {
      return NextResponse.json({ message: "Player not found" }, { status: 404 });
    }

    // Create the response and set the cache control header
    const response = NextResponse.json(player, { status: 200 });

    // Prevent caching for this response
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    console.error("Error fetching player:", error);  // Log the error for better debugging
    return NextResponse.json({ message: "Server Error", error: (error as Error).message }, { status: 500 });
  }
}
