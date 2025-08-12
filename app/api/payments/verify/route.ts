import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ message: "Reference is required" }, { status: 400 })
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!paystackResponse.ok) {
      return NextResponse.json({ message: "Payment verification failed" }, { status: 500 })
    }

    const paystackData = await paystackResponse.json()

    if (paystackData.data.status === "success") {
      const supabase = createServerClient()

      const ticketData = {
        event_id: paystackData.data.metadata.eventId,
        ticket_type_id: paystackData.data.metadata.ticketTypeId,
        attendee_info: JSON.parse(paystackData.data.metadata.attendeeInfo),
        payment_reference: reference,
        amount: paystackData.data.amount / 100,
        status: "active",
        ticket_code: `${paystackData.data.metadata.eventId.slice(-4)}-${reference.slice(-6)}`,
        qr_code_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/qr/${reference}`,
      }

      const { data: ticket, error } = await supabase.from("tickets").insert(ticketData).select().single()

      if (error) {
        console.error("Ticket creation error:", error)
        return NextResponse.json({ message: "Failed to create ticket" }, { status: 500 })
      }

      // Record the purchase in the purchases table
      await supabase.from("purchases").insert({
        event_id: ticketData.event_id,
        user_email: ticketData.attendee_info.email,
        amount: ticketData.amount,
        payment_reference: reference,
        payment_status: "completed",
        ticket_id: ticket.id,
      })

      return NextResponse.json({
        success: true,
        ticket,
        message: "Payment successful and ticket created",
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Payment was not successful",
        status: paystackData.data.status,
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
