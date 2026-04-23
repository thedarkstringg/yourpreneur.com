import { NextRequest, NextResponse } from "next/server";
import { getMockEvents } from "@/lib/mockData";

/**
 * GET /api/events
 * Fetch all events, optionally filtered by venture
 * Query params: ?venture_id=XXX (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ventureId = searchParams.get("venture_id");

    // TODO: Replace with real Supabase query
    const events = await getMockEvents();

    // Filter by venture if provided
    let filtered = events;
    if (ventureId) {
      filtered = events.filter((e) => e.venture_id === ventureId);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Create a new event
 * Body: { venture_id, event_type, title, notes?, event_date, link_url? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { venture_id, event_type, title, notes, event_date, link_url } = body;

    // Validation
    if (!venture_id || !event_type || !title || !event_date) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: venture_id, event_type, title, event_date",
        },
        { status: 400 }
      );
    }

    // TODO: Replace with real Supabase insert
    const newEvent = {
      id: `event-${Date.now()}`,
      venture_id,
      user_id: "user-1", // TODO: Get from session
      event_type,
      title,
      notes: notes || "",
      event_date,
      link_url: link_url || null,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newEvent,
        message: "Event logged successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log event" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/events/:id
 * Delete an event
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get("id");

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "Missing event ID" },
        { status: 400 }
      );
    }

    // TODO: Replace with real Supabase delete
    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
      id: eventId,
    });
  } catch (error) {
    console.error("DELETE /api/events error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
