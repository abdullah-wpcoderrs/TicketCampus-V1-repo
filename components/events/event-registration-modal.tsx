"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Ticket } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PaystackPayment } from "@/components/payments/paystack-payment"

interface EventRegistrationModalProps {
  event: any
  selectedTicketType: string | null
  isOpen: boolean
  onClose: () => void
}

export function EventRegistrationModal({ event, selectedTicketType, isOpen, onClose }: EventRegistrationModalProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // Attendee Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Registration Options
    createAccount: false,
    password: "",
    confirmPassword: "",

    // Custom Fields (would be dynamic based on event)
    dietaryRequirements: "",

    // Agreement
    agreeToTerms: false,
    subscribeToUpdates: false,
  })

  const selectedTicket = selectedTicketType ? event.ticketTypes.find((t: any) => t.id === selectedTicketType) : null

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast({
          title: "Please fill in required fields",
          description: "First name, last name, and email are required.",
          variant: "destructive",
        })
        return
      }
      if (formData.createAccount && (!formData.password || formData.password !== formData.confirmPassword)) {
        toast({
          title: "Password error",
          description: "Please enter matching passwords.",
          variant: "destructive",
        })
        return
      }
    }

    if (step === 2 && !formData.agreeToTerms) {
      toast({
        title: "Please accept terms",
        description: "You must agree to the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    setStep(step + 1)
  }

  const handleFreeRegistration = async () => {
    setIsSubmitting(true)

    try {
      // For free events, create ticket directly
      const response = await fetch("/api/tickets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          attendeeInfo: formData,
          ticketType: "free",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create ticket")
      }

      const ticket = await response.json()

      toast({
        title: "Registration successful!",
        description: `Your ticket code is ${ticket.ticketCode}. Check your email for details.`,
      })

      onClose()
      resetForm()
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = (reference: string) => {
    toast({
      title: "Payment successful!",
      description: "Redirecting to your ticket details...",
    })
    // Redirect will be handled by Paystack callback
  }

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    })
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      createAccount: false,
      password: "",
      confirmPassword: "",
      dietaryRequirements: "",
      agreeToTerms: false,
      subscribeToUpdates: false,
    })
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Attendee Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+234 800 000 0000"
          />
        </div>
      </div>

      {event.allowGuestRegistration && (
        <div className="space-y-4">
          <Separator />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="createAccount"
              checked={formData.createAccount}
              onCheckedChange={(checked) => handleInputChange("createAccount", checked)}
            />
            <Label htmlFor="createAccount">Create an account to manage your registrations</Label>
          </div>

          {formData.createAccount && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="At least 6 characters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Additional Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dietary">Dietary Requirements (Optional)</Label>
            <Input
              id="dietary"
              value={formData.dietaryRequirements}
              onChange={(e) => handleInputChange("dietaryRequirements", e.target.value)}
              placeholder="Any dietary restrictions or preferences"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed">
            I agree to the{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="updates"
            checked={formData.subscribeToUpdates}
            onCheckedChange={(checked) => handleInputChange("subscribeToUpdates", checked)}
          />
          <Label htmlFor="updates" className="text-sm">
            Subscribe to event updates and newsletters
          </Label>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => {
    if (event.eventType === "free") {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Registration Summary</h3>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Event</span>
                    <span>{event.title}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Attendee</span>
                    <span>
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Email</span>
                    <span>{formData.email}</span>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-lg font-bold text-green-600">Free Registration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    // For paid events, show payment component
    return (
      <div className="space-y-6">
        <PaystackPayment
          event={event}
          ticketType={selectedTicket}
          attendeeInfo={formData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Ticket className="w-5 h-5 mr-2" />
            Register for Event
          </DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? "Personal Information" : step === 2 ? "Additional Details" : "Confirmation"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}

          <div className="flex items-center space-x-2 ml-auto">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            {step < 3 ? (
              <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
                Next
              </Button>
            ) : event.eventType === "free" ? (
              <Button
                onClick={handleFreeRegistration}
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Complete Registration
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
