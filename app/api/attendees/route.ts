import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const eventId = searchParams.get("eventId")

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Build query for attendees
    let query = supabase
      .from("purchases")
      .select(`
        id,
        event_id,
        user_email,
        amount,
        payment_status,
        created_at,
        tickets (
          id,
          attendee_info,
          ticket_type,
          status
        ),
        events (
          id,
          title,
          user_id
        )
      `)
      .eq("events.user_id", userId)
      .eq("payment_status", "completed")

    if (eventId) {
      query = query.eq("event_id", eventId)
    }

    const { data: attendeeData, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Attendees fetch error:", error)
      return NextResponse.json({ message: "Failed to fetch attendees" }, { status: 500 })
    }

    // Transform data for frontend
    const attendees = attendeeData.map(purchase => {
      const ticket = purchase.tickets?.[0]
      const attendeeInfo = ticket?.attendee_info || {}
      
      return {
        id: purchase.id,
        name: attendeeInfo.name || attendeeInfo.firstName + " " + attendeeInfo.lastName || "N/A",
        email: purchase.user_email || attendeeInfo.email,
        phone: attendeeInfo.phone || "N/A",
        eventTitle: purchase.events?.title || "Unknown Event",
        eventId: purchase.event_id,
        ticketType: ticket?.ticket_type || "General",
        registrationDate: purchase.created_at,
        status: ticket?.status === "active" ? "confirmed" : "pending",
        amount: purchase.amount || 0
      }
    })

    return NextResponse.json(attendees)
  } catch (error) {
    console.error("Attendees fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch attendees" }, { status: 500 })
  }
}
