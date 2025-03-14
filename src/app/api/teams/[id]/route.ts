import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/Team';

interface Context {
  params: {
    id: string;
  };
}

export async function PUT(req: NextRequest, { params }: Context) {
  try {
    const { id } = params; // Access the id from params
    const { approvalStatus } = await req.json(); // Get the new approval status

    // Connect to the database
    await dbConnect();

    // Find the team by ID and update its approval status
    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { approvalStatus },
      { new: true }
    );

    if (!updatedTeam) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating approval status', error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    const { id } = params; // Access the id from params

    // Connect to the database
    await dbConnect();

    // Delete the team by its ID
    const deletedTeam = await Team.findByIdAndDelete(id);

    if (!deletedTeam) {
      return NextResponse.json(
        { message: 'Team not found' },
        { status: 404 }
      );
    }

    // Return a success message
    return NextResponse.json({ message: 'Team deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting team', error },
      { status: 500 }
    );
  }
}
