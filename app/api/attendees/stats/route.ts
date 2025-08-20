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

    // Get all purchases for user's events
    const { data: purchases, error } = await supabase
      .from("purchases")
      .select(`
        id,
        amount,
        payment_status,
        tickets (
          status
        ),
        events!inner (
          user_id
        )
      `)
      .eq("events.user_id", userId)

    if (error) {
      console.error("Attendee stats fetch error:", error)
      return NextResponse.json({ message: "Failed to fetch attendee stats" }, { status: 500 })
    }

    // Calculate statistics
    const completedPurchases = purchases.filter(p => p.payment_status === "completed")
    const totalAttendees = completedPurchases.length
    
    const confirmedAttendees = completedPurchases.filter(p => 
      p.tickets?.[0]?.status === "active"
    ).length
    
    const pendingAttendees = completedPurchases.filter(p => 
      p.tickets?.[0]?.status !== "active"
    ).length

    const totalRevenue = completedPurchases.reduce((sum, purchase) => 
      sum + (purchase.amount || 0), 0
    )

    const stats = {
      totalAttendees,
      confirmedAttendees,
      pendingAttendees,
      totalRevenue
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Attendee stats error:", error)
    return NextResponse.json({ message: "Failed to fetch attendee stats" }, { status: 500 })
  }
}
