import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName } = body;

    // Stub: In production, would call Supabase auth or your backend
    return NextResponse.json({
      success: true,
      message: 'Signup endpoint stub',
      email,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to signup' }, { status: 400 });
  }
}
