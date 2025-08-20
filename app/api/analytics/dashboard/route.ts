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

    // Get user's events
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("id, title, start_date, end_date, is_published, event_type, max_capacity")
      .eq("user_id", userId)

    if (eventsError) {
      console.error("Events fetch error:", eventsError)
      return NextResponse.json({ message: "Failed to fetch events" }, { status: 500 })
    }

    // Get ticket sales data
    const eventIds = events.map(event => event.id)
    let ticketSales = []
    let totalRevenue = 0
    let totalAttendees = 0

    if (eventIds.length > 0) {
      const { data: purchases, error: purchasesError } = await supabase
        .from("purchases")
        .select("event_id, amount, payment_status")
        .in("event_id", eventIds)
        .eq("payment_status", "completed")

      if (!purchasesError && purchases) {
        ticketSales = purchases
        totalRevenue = purchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0)
        totalAttendees = purchases.length
      }
    }

    // Calculate stats
    const now = new Date()
    const activeEvents = events.filter(event => {
      const startDate = new Date(event.start_date)
      const endDate = new Date(event.end_date)
      return event.is_published && startDate <= now && endDate >= now
    }).length

    const upcomingEvents = events.filter(event => {
      const startDate = new Date(event.start_date)
      return event.is_published && startDate > now
    }).length

    const completedEvents = events.filter(event => {
      const endDate = new Date(event.end_date)
      return endDate < now
    }).length

    // Get recent events with attendee counts
    const recentEvents = await Promise.all(
      events
        .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
        .slice(0, 5)
        .map(async (event) => {
          const eventSales = ticketSales.filter(sale => sale.event_id === event.id)
          const eventRevenue = eventSales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
          const eventAttendees = eventSales.length

          // Determine status
          const startDate = new Date(event.start_date)
          const endDate = new Date(event.end_date)
          let status = "draft"
          
          if (event.is_published) {
            if (endDate < now) status = "completed"
            else if (startDate > now) status = "upcoming"
            else status = "active"
          }

          return {
            id: event.id,
            title: event.title,
            date: event.start_date,
            attendees: eventAttendees,
            revenue: eventRevenue,
            status,
            maxCapacity: event.max_capacity
          }
        })
    )

    const dashboardStats = {
      totalEvents: events.length,
      totalAttendees,
      totalRevenue,
      activeEvents,
      upcomingEvents,
      completedEvents,
      recentEvents
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error("Dashboard analytics error:", error)
    return NextResponse.json(
      { message: "Failed to fetch dashboard analytics" },
      { status: 500 }
    )
  }
}
