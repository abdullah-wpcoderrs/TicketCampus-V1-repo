import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { eventId, attendeeInfo, ticketType } = await request.json()
    const supabase = createServerClient()

    // Generate ticket for free events
    const ticketCode = `FREE_${eventId.slice(-4)}_${Date.now().toString().slice(-6)}`

    const { data: ticket, error } = await supabase
      .from("tickets")
      .insert({
        event_id: eventId,
        attendee_info: attendeeInfo,
        ticket_type: "free",
        ticket_code: ticketCode,
        qr_code_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/qr/${ticketCode}`,
        status: "active",
        amount: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Free ticket creation error:", error)
      return NextResponse.json({ message: "Failed to create ticket" }, { status: 500 })
    }

    // Record the free registration in the purchases table
    await supabase.from("purchases").insert({
      event_id: eventId,
      user_email: attendeeInfo.email,
      amount: 0,
      payment_reference: ticketCode,
      payment_status: "completed",
      ticket_id: ticket.id,
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Free ticket creation error:", error)
    return NextResponse.json({ message: "Failed to create ticket" }, { status: 500 })
  }
}
