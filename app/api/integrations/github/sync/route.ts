import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    // Stub: Fetch repositories from GitHub and sync with Supabase ventures
    // In production: Use GitHub API to get repos, create ventures from them

    return NextResponse.json({
      success: true,
      message: 'GitHub sync stub',
      synced: 0,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 400 });
  }
}
