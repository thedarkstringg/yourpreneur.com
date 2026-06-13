import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    // Stub: Exchange GitHub code for token
    // In production: POST to GitHub token endpoint, store in Supabase

    return NextResponse.json({
      success: true,
      message: 'GitHub callback stub',
      token: 'github_token_stub',
    });
  } catch (error) {
    return NextResponse.json({ error: 'GitHub auth failed' }, { status: 400 });
  }
}
