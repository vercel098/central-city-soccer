import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Player from "@/models/Player";

export async function PUT(req: NextRequest) {
  try {
    const playerData = await req.json(); // Parse the incoming data
    await dbConnect();

    // Ensure the player exists in the database
    const player = await Player.findOne({ playerId: playerData.playerId });

    if (!player) {
      return NextResponse.json({ message: "Player not found" }, { status: 404 });
    }

    // Update the player's profile information
    player.fullName = playerData.fullName || player.fullName;
    player.contactNumber = playerData.contactNumber || player.contactNumber;
    player.guardianInfo.guardianName = playerData.guardianName || player.guardianInfo.guardianName;
    player.guardianInfo.guardianContactNumber = playerData.guardianContactNumber || player.guardianInfo.guardianContactNumber;

    // Update nationality if provided
    if (playerData.nationality) {
      player.nationality = playerData.nationality;
    }

    // Update files (images) only if they exist in the request
    if (playerData.birthCertificate) {
      player.documents.birthCertificate = playerData.birthCertificate;
    }

    if (playerData.passportSizePhoto) {
      player.documents.passportSizePhoto = playerData.passportSizePhoto;
    }

    // Save the updated player data
    await player.save();

    return NextResponse.json(player, { status: 200 });
  } catch (error) {
    console.error("Error updating player:", error);
    return NextResponse.json({ message: "Error updating player", error }, { status: 500 });
  }
}
