import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")
    const userId = searchParams.get("userId")

    if (!eventId && !userId) {
      return NextResponse.json({ message: "Event ID or User ID is required" }, { status: 400 })
    }

    let query = supabase
      .from("ticket_types")
      .select(`
        *,
        events (
          id,
          title,
          user_id
        )
      `)

    if (eventId) {
      query = query.eq("event_id", eventId)
    } else if (userId) {
      query = query.eq("events.user_id", userId)
    }

    const { data: ticketTypes, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Ticket types fetch error:", error)
      return NextResponse.json({ message: "Failed to fetch ticket types" }, { status: 500 })
    }

    // Transform data for frontend
    const formattedTicketTypes = ticketTypes.map(ticket => ({
      id: ticket.id,
      name: ticket.name,
      eventTitle: ticket.events?.title || "Unknown Event",
      eventId: ticket.event_id,
      price: ticket.price || 0,
      totalQuantity: ticket.quantity_available || 0,
      soldQuantity: ticket.quantity_sold || 0,
      status: ticket.is_active ? 
        (ticket.quantity_sold >= ticket.quantity_available ? "sold_out" : "active") : 
        "inactive",
      description: ticket.description || "",
      saleStartDate: ticket.sale_start_date,
      saleEndDate: ticket.sale_end_date
    }))

    return NextResponse.json(formattedTicketTypes)
  } catch (error) {
    console.error("Ticket types fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch ticket types" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const ticketData = await request.json()

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify user owns the event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("user_id")
      .eq("id", ticketData.eventId)
      .single()

    if (eventError || !event || event.user_id !== user.id) {
      return NextResponse.json({ message: "Event not found or unauthorized" }, { status: 404 })
    }

    const insertData = {
      event_id: ticketData.eventId,
      name: ticketData.name,
      description: ticketData.description || "",
      price: parseFloat(ticketData.price) || 0,
      quantity_available: parseInt(ticketData.quantity) || 0,
      quantity_sold: 0,
      sale_start_date: ticketData.saleStartDate || new Date().toISOString(),
      sale_end_date: ticketData.saleEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true
    }

    const { data: newTicketType, error } = await supabase
      .from("ticket_types")
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("Ticket type creation error:", error)
      return NextResponse.json({ message: "Failed to create ticket type" }, { status: 500 })
    }

    return NextResponse.json(newTicketType)
  } catch (error) {
    console.error("Ticket type creation error:", error)
    return NextResponse.json({ message: "Failed to create ticket type" }, { status: 500 })
  }
}
