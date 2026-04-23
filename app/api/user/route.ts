import { NextRequest, NextResponse } from "next/server";
import { getMockUser } from "@/lib/mockData";

/**
 * GET /api/user
 * Fetch current user profile
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with real Supabase query using session
    const user = await getMockUser();

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user
 * Update current user profile
 * Body: { name?, display_title?, avatar_url? }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, display_title, avatar_url } = body;

    // TODO: Replace with real Supabase update using session
    const updatedUser = {
      id: "user-1",
      name: name || "Entrepreneur",
      display_title: display_title || "Vol. 01",
      avatar_url: avatar_url || null,
    };

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/export
 * Export user data as JSON or CSV
 * Body: { format: 'json' | 'csv' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format } = body;

    if (!format || (format !== "json" && format !== "csv")) {
      return NextResponse.json(
        { success: false, error: "Invalid format. Use 'json' or 'csv'" },
        { status: 400 }
      );
    }

    // TODO: Replace with real Supabase queries
    // For now, return success (actual export happens client-side in settings page)
    return NextResponse.json({
      success: true,
      message: `Data export prepared as ${format.toUpperCase()}`,
    });
  } catch (error) {
    console.error("POST /api/user/export error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to prepare export" },
      { status: 500 }
    );
  }
}
