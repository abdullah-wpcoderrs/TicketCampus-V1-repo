"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaystackPaymentProps {
  event: any
  ticketType: any
  attendeeInfo: any
  onSuccess: (reference: string) => void
  onError: (error: string) => void
}

export function PaystackPayment({ event, ticketType, attendeeInfo, onSuccess, onError }: PaystackPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const initializePayment = async () => {
    setIsProcessing(true)

    try {
      // Initialize payment with Paystack
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          ticketTypeId: ticketType.id,
          attendeeInfo,
          amount: ticketType.price * 100, // Paystack expects amount in kobo
          email: attendeeInfo.email,
          metadata: {
            eventTitle: event.title,
            ticketTypeName: ticketType.name,
            attendeeName: `${attendeeInfo.firstName} ${attendeeInfo.lastName}`,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to initialize payment")
      }

      const { authorization_url, reference } = await response.json()

      // Redirect to Paystack payment page
      window.location.href = authorization_url
    } catch (error) {
      console.error("Payment initialization error:", error)
      onError("Failed to initialize payment. Please try again.")
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Details
        </CardTitle>
        <CardDescription>Secure payment powered by Paystack</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Event</span>
            <span className="text-sm">{event.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Ticket Type</span>
            <span className="text-sm">{ticketType.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Quantity</span>
            <span className="text-sm">1</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>₦{ticketType.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Secure Payment</span>
          </div>
          <p className="text-xs text-green-700">
            Your payment is secured by Paystack with 256-bit SSL encryption. We never store your card details.
          </p>
        </div>

        {/* Payment Button */}
        <Button
          onClick={initializePayment}
          disabled={isProcessing}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Initializing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ₦{ticketType.price.toLocaleString()}
            </>
          )}
        </Button>

        {/* Accepted Payment Methods */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">We accept</p>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Visa
            </Badge>
            <Badge variant="outline" className="text-xs">
              Mastercard
            </Badge>
            <Badge variant="outline" className="text-xs">
              Verve
            </Badge>
            <Badge variant="outline" className="text-xs">
              Bank Transfer
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
