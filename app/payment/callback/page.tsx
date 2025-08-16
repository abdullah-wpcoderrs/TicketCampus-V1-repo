"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Download, Calendar } from "lucide-react"
import Link from "next/link"

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "failed">("loading")
  const [ticketData, setTicketData] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const reference = searchParams.get("reference")

    if (!reference) {
      setVerificationStatus("failed")
      setError("No payment reference found")
      return
    }

    verifyPayment(reference)
  }, [searchParams])

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      })

      const data = await response.json()

      if (data.success) {
        setVerificationStatus("success")
        setTicketData(data.ticket)
      } else {
        setVerificationStatus("failed")
        setError(data.message || "Payment verification failed")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setVerificationStatus("failed")
      setError("Failed to verify payment")
    }
  }

  const downloadTicket = () => {
    // Generate and download ticket PDF
    // In a real app, you would generate a proper PDF ticket
    const ticketContent = `
Event Ticket
============
Ticket Code: ${ticketData.ticketCode}
Event: ${ticketData.eventId}
Amount Paid: ₦${ticketData.amount.toLocaleString()}
Payment Reference: ${ticketData.paymentReference}
Date: ${new Date(ticketData.createdAt).toLocaleDateString()}

Please present this ticket at the event entrance.
    `

    const blob = new Blob([ticketContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ticket-${ticketData.ticketCode}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (verificationStatus === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Link href="/events">
                  <Button className="w-full">Browse Events</Button>
                </Link>
                <Button variant="outline" onClick={() => router.back()}>
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ThePlace</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-4">Your ticket has been confirmed and sent to your email address.</p>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Registration Complete
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Ticket</CardTitle>
              <CardDescription>Keep this information safe and present it at the event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Banner Image */}
              {ticketData.event?.banner_image_url && (
                <div className="w-full mb-4">
                  <img
                    src={ticketData.event.banner_image_url}
                    alt="Event Banner"
                    className="w-full h-40 object-cover rounded-lg"
                    onError={e => { e.currentTarget.src = "/placeholder.svg" }}
                  />
                </div>
              )}

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-purple-900 mb-2">Ticket Code</h3>
                  <p className="text-2xl font-mono font-bold text-purple-700">{ticketData.ticketCode}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-500">Amount Paid:</span> ₦{ticketData.amount.toLocaleString()}
                    </p>
                    <p>
                      <span className="text-gray-500">Reference:</span> {ticketData.paymentReference}
                    </p>
                    <p>
                      <span className="text-gray-500">Date:</span> {new Date(ticketData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Attendee Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-500">Name:</span> {ticketData.attendeeInfo.firstName}{" "}
                      {ticketData.attendeeInfo.lastName}
                    </p>
                    <p>
                      <span className="text-gray-500">Email:</span> {ticketData.attendeeInfo.email}
                    </p>
                    {ticketData.attendeeInfo.phone && (
                      <p>
                        <span className="text-gray-500">Phone:</span> {ticketData.attendeeInfo.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>Show this QR code at the event for quick check-in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketData.ticketCode}`}
                    alt="Ticket QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Scan this code at the event entrance</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={downloadTicket} className="flex-1 bg-transparent" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Ticket
            </Button>
            <Link href="/events" className="flex-1">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Browse More Events</Button>
            </Link>
          </div>

          {/* Important Notes */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Please arrive at least 15 minutes before the event starts</li>
                <li>• Bring a valid ID that matches the name on your ticket</li>
                <li>• Your ticket confirmation has been sent to your email</li>
                <li>• For any issues, contact the event organizer</li>
                <li>• Tickets are non-transferable and non-refundable</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
