import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { eventId, ticketTypeId, attendeeInfo, amount, email, metadata } = await request.json()

    // Validate required fields
    if (!eventId || !ticketTypeId || !attendeeInfo || !amount || !email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Generate unique reference
    const reference = `TKT_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Initialize payment with Paystack
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount, // Amount in kobo
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: {
          ...metadata,
          eventId,
          ticketTypeId,
          attendeeInfo: JSON.stringify(attendeeInfo),
        },
      }),
    })

    if (!paystackResponse.ok) {
      const error = await paystackResponse.json()
      console.error("Paystack initialization error:", error)
      return NextResponse.json({ message: "Payment initialization failed" }, { status: 500 })
    }

    const paystackData = await paystackResponse.json()

    // Store payment record in database (replace with actual database insert)
    const paymentRecord = {
      reference,
      eventId,
      ticketTypeId,
      attendeeInfo,
      amount: amount / 100, // Convert back to naira
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // In a real app, you would save this to your database
    console.log("Payment record created:", paymentRecord)

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
    })
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
