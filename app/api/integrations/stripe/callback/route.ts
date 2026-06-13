import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    // Stub: Exchange Stripe code for token

    return NextResponse.json({
      success: true,
      message: 'Stripe callback stub',
      token: 'stripe_token_stub',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Stripe auth failed' }, { status: 400 });
  }
}
