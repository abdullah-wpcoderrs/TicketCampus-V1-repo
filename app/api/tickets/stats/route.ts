import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get ticket types for user's events
    const { data: ticketTypes, error } = await supabase
      .from("ticket_types")
      .select(`
        *,
        events!inner (
          user_id
        )
      `)
      .eq("events.user_id", userId)

    if (error) {
      console.error("Ticket stats fetch error:", error)
      return NextResponse.json({ message: "Failed to fetch ticket stats" }, { status: 500 })
    }

    // Calculate statistics
    const totalTicketTypes = ticketTypes.length
    const activeTickets = ticketTypes.filter(t => t.is_active && t.quantity_sold < t.quantity_available).length
    const soldOut = ticketTypes.filter(t => t.quantity_sold >= t.quantity_available).length
    const totalRevenue = ticketTypes.reduce((sum, ticket) => 
      sum + (ticket.quantity_sold * ticket.price), 0
    )

    const stats = {
      totalTicketTypes,
      activeTickets,
      soldOut,
      totalRevenue
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Ticket stats error:", error)
    return NextResponse.json({ message: "Failed to fetch ticket stats" }, { status: 500 })
  }
}
