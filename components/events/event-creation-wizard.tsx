"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { BasicInfoStep } from "./wizard-steps/basic-info-step"
import { DateTimeStep } from "./wizard-steps/datetime-step"
import { LocationStep } from "./wizard-steps/location-step"
import { MediaStep } from "./wizard-steps/media-step"
import { TicketsStep } from "./wizard-steps/tickets-step"
import { SettingsStep } from "./wizard-steps/settings-step"
import { ReviewStep } from "./wizard-steps/review-step"
import { useToast } from "@/hooks/use-toast"

export interface EventFormData {
  // Basic Info
  title: string
  description: string
  category: string
  eventType: "free" | "paid" | "donation"

  // Date & Time
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  timezone: string

  // Location
  isOnline: boolean
  venueName: string
  venueAddress: string
  city: string
  state: string
  country: string
  meetingLink: string

  // Media
  bannerImage: File | null
  galleryImages: File[]

  // Tickets
  ticketTypes: Array<{
    id: string
    name: string
    description: string
    price: number
    quantity: number
    saleStartDate: string
    saleEndDate: string
  }>

  // Settings
  maxCapacity: number
  requiresApproval: boolean
  allowGuestRegistration: boolean
  customFields: Array<{
    id: string
    label: string
    type: "text" | "email" | "phone" | "select"
    required: boolean
    options?: string[]
  }>

  // SEO
  slug: string
  metaDescription: string
}

const steps = [
  { id: 1, title: "Basic Info", description: "Event details and category" },
  { id: 2, title: "Date & Time", description: "When your event happens" },
  { id: 3, title: "Location", description: "Where your event takes place" },
  { id: 4, title: "Media", description: "Images and visual content" },
  { id: 5, title: "Tickets", description: "Pricing and ticket types" },
  { id: 6, title: "Settings", description: "Additional configurations" },
  { id: 7, title: "Review", description: "Review and publish" },
]

export function EventCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    category: "",
    eventType: "free",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    timezone: "Africa/Lagos",
    isOnline: false,
    venueName: "",
    venueAddress: "",
    city: "",
    state: "",
    country: "Nigeria",
    meetingLink: "",
    bannerImage: null,
    galleryImages: [],
    ticketTypes: [],
    maxCapacity: 0,
    requiresApproval: false,
    allowGuestRegistration: true,
    customFields: [],
    slug: "",
    metaDescription: "",
  })

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.category)
      case 2:
        return !!(formData.startDate && formData.endDate && formData.startTime && formData.endTime)
      case 3:
        return formData.isOnline ? !!formData.meetingLink : !!(formData.venueName && formData.venueAddress)
      case 4:
        return true // Media is optional
      case 5:
        return formData.eventType === "free" || formData.ticketTypes.length > 0
      case 6:
        return true // Settings are optional
      case 7:
        return true // Review step
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    } else {
      toast({
        title: "Please complete required fields",
        description: "Fill in all required information before proceeding.",
        variant: "destructive",
      })
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      const event = await response.json()

      toast({
        title: "Event created successfully!",
        description: "Your event has been created and is ready to be published.",
      })

      router.push(`/dashboard/events/${event.id}`)
    } catch (error) {
      toast({
        title: "Error creating event",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />
      case 2:
        return <DateTimeStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return <LocationStep formData={formData} updateFormData={updateFormData} />
      case 4:
        return <MediaStep formData={formData} updateFormData={updateFormData} />
      case 5:
        return <TicketsStep formData={formData} updateFormData={updateFormData} />
      case 6:
        return <SettingsStep formData={formData} updateFormData={updateFormData} />
      case 7:
        return <ReviewStep formData={formData} />
      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-600">Follow the steps below to create your event</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.id < currentStep
                    ? "bg-purple-600 border-purple-600 text-white"
                    : step.id === currentStep
                      ? "border-purple-600 text-purple-600"
                      : "border-gray-300 text-gray-400"
                }`}
              >
                {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${step.id < currentStep ? "bg-purple-600" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          {steps.map((step) => (
            <div key={step.id} className="text-center" style={{ width: "120px" }}>
              <p className="text-xs font-medium text-gray-900">{step.title}</p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 flex items-center"
          >
            {isSubmitting ? "Creating..." : "Create Event"}
            <Check className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700 flex items-center">
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
