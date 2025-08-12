import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { reference: string } }) {
  try {
    const { reference } = params

    if (!reference) {
      return NextResponse.json({ message: "Reference is required" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Verify the reference exists in your database
    // 2. Generate a proper QR code with ticket information
    // 3. Return the QR code image

    // For now, redirect to a QR code service
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${reference}&format=png`

    return NextResponse.redirect(qrCodeUrl)
  } catch (error) {
    console.error("QR code generation error:", error)
    return NextResponse.json({ message: "Failed to generate QR code" }, { status: 500 })
  }
}
