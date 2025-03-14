import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/Team';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use your secret key

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { teamId: string };
    await dbConnect();

    const team = await Team.findById(decoded.teamId);
    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }

    const response = NextResponse.json({ team }, { status: 200 });

    // Prevent caching for this response
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { teamId: string };
    await dbConnect();

    const { updates } = await req.json();

    const team = await Team.findByIdAndUpdate(decoded.teamId, updates, { new: true });

    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ team }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
