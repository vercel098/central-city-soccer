import {  NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Player from '@/models/Player';

interface AggregatedResult {
  _id: string;
  count: number;
}

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Use aggregation to count players by their status (Pending or Approved)
    const result = await Player.aggregate([
      {
        $group: {
          _id: '$status', // Group by status field (Pending or Approved)
          count: { $sum: 1 }, // Count the number of players in each status
        },
      },
    ]);

    // Structure the result to return counts for Pending and Approved
    const counts = {
      Pending: 0,
      Approved: 0,
    };

    // Loop through the aggregation result and assign counts
    result.forEach((status: AggregatedResult) => {
      if (status._id === 'Pending') {
        counts.Pending = status.count;
      } else if (status._id === 'Approved') {
        counts.Approved = status.count;
      }
    });

    // Return the counts as a JSON response
    return NextResponse.json(counts, { status: 200 });
  } catch (error) {
    // Return an error response in case of failure
    return NextResponse.json(
      { message: 'Error fetching player counts', error },
      { status: 500 }
    );
  }
}
