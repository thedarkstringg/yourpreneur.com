import { NextRequest, NextResponse } from "next/server";
import { getMockVentures } from "@/lib/mockData";

/**
 * GET /api/ventures
 * Fetch all ventures, optionally filtered by year
 * Query params: ?year=2024 (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year");

    // TODO: Replace with real Supabase query
    const ventures = await getMockVentures();

    // Filter by year if provided
    let filtered = ventures;
    if (year) {
      const yearNum = parseInt(year);
      filtered = ventures.filter((v) => {
        const startYear = new Date(v.started_date).getFullYear();
        const endYear = v.ended_date
          ? new Date(v.ended_date).getFullYear()
          : new Date().getFullYear();
        return startYear <= yearNum && endYear >= yearNum;
      });
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    console.error("GET /api/ventures error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ventures" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ventures
 * Create a new venture
 * Body: { name, description, industry, started_date, ended_date? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, industry, started_date, ended_date } = body;

    // Validation
    if (!name || !industry || !started_date) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, industry, started_date",
        },
        { status: 400 }
      );
    }

    // TODO: Replace with real Supabase insert
    const newVenture = {
      id: `venture-${Date.now()}`,
      user_id: "user-1", // TODO: Get from session
      name,
      description: description || "",
      industry,
      status: "active" as const,
      started_date,
      ended_date: ended_date || null,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newVenture,
        message: "Venture created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/ventures error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create venture" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ventures/:id
 * Update an existing venture
 * Note: Uses a query parameter for now (route params work differently)
 */
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ventureId = searchParams.get("id");

    if (!ventureId) {
      return NextResponse.json(
        { success: false, error: "Missing venture ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // TODO: Replace with real Supabase update
    // For now, just return success (mock)
    return NextResponse.json({
      success: true,
      message: "Venture updated successfully",
      id: ventureId,
    });
  } catch (error) {
    console.error("PUT /api/ventures error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update venture" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ventures/:id
 * Delete a venture
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ventureId = searchParams.get("id");

    if (!ventureId) {
      return NextResponse.json(
        { success: false, error: "Missing venture ID" },
        { status: 400 }
      );
    }

    // TODO: Replace with real Supabase delete
    return NextResponse.json({
      success: true,
      message: "Venture deleted successfully",
      id: ventureId,
    });
  } catch (error) {
    console.error("DELETE /api/ventures error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete venture" },
      { status: 500 }
    );
  }
}
