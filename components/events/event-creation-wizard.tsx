"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { BasicInfoStep } from "./wizard-steps/basic-info-step"
import { LocationStep } from "./wizard-steps/location-step"
import { MediaStep } from "./wizard-steps/media-step"
import { TicketsStep } from "./wizard-steps/tickets-step"
import { PromotionalStep } from "./wizard-steps/promotional-step"
import { ReviewStep } from "./wizard-steps/review-step"
import { GetDPTemplateStep } from "./wizard-steps/getdp-template-step"
import { EventSuccessModal } from "./event-success-modal"
import { useToast } from "@/hooks/use-toast"

export interface EventFormData {
  // Basic Info
  title: string
  description: string
  category: string
  eventType: "free" | "paid" | "donation"

  // Date & Time (merged into Basic Info)
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  timezone: string

  // Dynamic step toggles
  enablePromotions: boolean
  promotionChannels: string[]
  enableGetDP: boolean

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

  // Tickets (dynamic)
  ticketTypes: Array<{
    id: string
    name: string
    description: string
    price: number
    quantity: number
    saleStartDate: string
    saleEndDate: string
  }>

  // Promotional Settings (dynamic)
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
  whatsappMessages: {
    confirmation: string
    reminder: string
  }
  emailMessages: {
    subject: string
    body: string
  }
  autoSendConfirmation: boolean
  autoSendReminders: boolean
  reminderTiming: string

  // SEO
  slug: string
  metaDescription: string

  // GetDP Template (dynamic)
  getdpTemplate: {
    enabled: boolean
    templateId: string
    templateName: string
    backgroundColor: string
    textColor: string
    eventLogo: File | null
    customText: string
    photoPlaceholder: {
      x: number
      y: number
      width: number
      height: number
    }
    namePlaceholder: {
      x: number
      y: number
      fontSize: number
    }
  }
}

const getSteps = (formData: EventFormData) => {
  const baseSteps = [
    { id: 1, title: "Basic Info", description: "Event details, date & time", key: "basic" },
    { id: 2, title: "Location", description: "Where your event takes place", key: "location" },
    { id: 3, title: "Media", description: "Images and visual content", key: "media" },
  ]

  const dynamicSteps = []
  let stepId = 4

  // Add Tickets step only for paid events
  if (formData.eventType === "paid" || formData.eventType === "donation") {
    dynamicSteps.push({
      id: stepId++,
      title: "Tickets",
      description: "Pricing and ticket types",
      key: "tickets",
    })
  }

  // Add GetDP step if enabled
  if (formData.enableGetDP) {
    dynamicSteps.push({
      id: stepId++,
      title: "GetDP Template",
      description: "Personalized attendee flyers",
      key: "getdp",
    })
  }

  // Add Promotional step if enabled
  if (formData.enablePromotions) {
    dynamicSteps.push({
      id: stepId++,
      title: "Promotional",
      description: "Marketing and registration settings",
      key: "promotional",
    })
  }

  // Always add Review as the last step
  const reviewStep = {
    id: stepId,
    title: "Review",
    description: "Review and publish",
    key: "review",
  }

  return [...baseSteps, ...dynamicSteps, reviewStep]
}

export function EventCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdEvent, setCreatedEvent] = useState<any>(null)
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
    enablePromotions: false,
    promotionChannels: [],
    enableGetDP: false,
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
    whatsappMessages: {
      confirmation: "",
      reminder: "",
    },
    emailMessages: {
      subject: "",
      body: "",
    },
    autoSendConfirmation: true,
    autoSendReminders: false,
    reminderTiming: "24h",
    slug: "",
    metaDescription: "",
    getdpTemplate: {
      enabled: false,
      templateId: "default",
      templateName: "I'm Attending",
      backgroundColor: "#3A00C1",
      textColor: "#FFFFFF",
      eventLogo: null,
      customText: "I'm attending {eventTitle}!",
      photoPlaceholder: {
        x: 50,
        y: 100,
        width: 120,
        height: 120,
      },
      namePlaceholder: {
        x: 50,
        y: 240,
        fontSize: 18,
      },
    },
  })

  const steps = useMemo(() => getSteps(formData), [formData])

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates }

      if (updates.title && !updates.slug) {
        newData.slug = updates.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      }

      const newSteps = getSteps(newData)
      const currentStepKey = steps.find((s) => s.id === currentStep)?.key
      const newCurrentStep = newSteps.find((s) => s.key === currentStepKey)?.id || 1

      if (newCurrentStep !== currentStep) {
        setCurrentStep(newCurrentStep)
      }

      return newData
    })
  }

  const validateStep = (step: number): boolean => {
    const stepKey = steps.find((s) => s.id === step)?.key

    switch (stepKey) {
      case "basic":
        return !!(
          formData.title &&
          formData.description &&
          formData.category &&
          formData.startDate &&
          formData.endDate &&
          formData.startTime &&
          formData.endTime
        )
      case "location":
        return formData.isOnline ? !!formData.meetingLink : !!(formData.venueName && formData.venueAddress)
      case "media":
        return true // Media is optional
      case "tickets":
        return formData.eventType === "free" || formData.ticketTypes.length > 0
      case "promotional":
        return true // Promotional settings are optional
      case "getdp":
        return true // GetDP template is optional
      case "review":
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
        description: "Fill in all required information before creating the event.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This ensures cookies are sent
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create event")
      }

      const event = await response.json()
      setCreatedEvent(event)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Event creation error:", error)
      toast({
        title: "Error creating event",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinueToDetails = () => {
    setShowSuccessModal(false)
    router.push(`/dashboard/events/${createdEvent.id}`)
  }

  const renderStep = () => {
    const stepKey = steps.find((s) => s.id === currentStep)?.key

    switch (stepKey) {
      case "basic":
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />
      case "location":
        return <LocationStep formData={formData} updateFormData={updateFormData} />
      case "media":
        return <MediaStep formData={formData} updateFormData={updateFormData} />
      case "tickets":
        return <TicketsStep formData={formData} updateFormData={updateFormData} />
      case "promotional":
        return <PromotionalStep formData={formData} updateFormData={updateFormData} />
      case "getdp":
        return <GetDPTemplateStep formData={formData} updateFormData={updateFormData} />
      case "review":
        return <ReviewStep formData={formData} />
      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="flex items-center text-gray-600 hover:text-gray-900 p-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
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
            <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
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

      {/* Success Modal */}
      {createdEvent && (
        <EventSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          event={createdEvent}
          onContinue={handleContinueToDetails}
        />
      )}
    </>
  )
}
