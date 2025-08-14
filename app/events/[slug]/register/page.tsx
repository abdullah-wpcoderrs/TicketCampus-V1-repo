"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  venue_name: string
  venue_address: string
  city: string
  state: string
  country: string
  is_online: boolean
  meeting_link: string
  banner_image_url: string
  max_capacity: number
  custom_fields: any[]
  event_type: string
}

interface TicketType {
  id: string
  name: string
  description: string
  price: number
  quantity_available: number
  quantity_sold: number
}

export default function EventRegistrationPage() {
  const params = useParams()
  const slug = params.slug as string
  const [event, setEvent] = useState<Event | null>(null)
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    attendee_name: "",
    attendee_email: "",
    attendee_phone: "",
    ticket_type_id: "",
    custom_field_responses: {} as Record<string, any>,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchEventData()
  }, [slug])

  const fetchEventData = async () => {
    try {
      // Fetch event by slug
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single()

      if (eventError) throw eventError

      setEvent(eventData)

      // Fetch ticket types
      const { data: ticketData, error: ticketError } = await supabase
        .from("ticket_types")
        .select("*")
        .eq("event_id", eventData.id)
        .eq("is_active", true)

      if (ticketError) throw ticketError

      setTicketTypes(ticketData || [])
    } catch (error) {
      console.error("Error fetching event:", error)
      toast.error("Event not found")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("attendee_registrations")
        .insert({
          event_id: event?.id,
          attendee_name: formData.attendee_name,
          attendee_email: formData.attendee_email,
          attendee_phone: formData.attendee_phone,
          ticket_type_id: formData.ticket_type_id || null,
          custom_field_responses: formData.custom_field_responses,
          registration_status: "confirmed",
          payment_status: "completed",
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Registration successful!")
      // Redirect to success page or show success modal
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      custom_field_responses: {
        ...prev.custom_field_responses,
        [fieldId]: value,
      },
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A00C1] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Event Not Found</h1>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const selectedTicket = ticketTypes.find((t) => t.id === formData.ticket_type_id)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          {event.banner_image_url && (
            <img
              src={event.banner_image_url || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{event.event_type}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-gray-600 mb-6">{event.description}</p>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {event.start_time} - {event.end_time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.is_online ? "Online Event" : `${event.venue_name}, ${event.city}`}</span>
              </div>
              {event.max_capacity && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Max {event.max_capacity} attendees</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Register for Event</CardTitle>
            <CardDescription>Fill out the form below to register for this event</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="attendee_name">Full Name *</Label>
                  <Input
                    id="attendee_name"
                    value={formData.attendee_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, attendee_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="attendee_email">Email Address *</Label>
                  <Input
                    id="attendee_email"
                    type="email"
                    value={formData.attendee_email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, attendee_email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="attendee_phone">Phone Number</Label>
                <Input
                  id="attendee_phone"
                  value={formData.attendee_phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, attendee_phone: e.target.value }))}
                />
              </div>

              {/* Ticket Selection */}
              {ticketTypes.length > 0 && (
                <div>
                  <Label>Select Ticket Type</Label>
                  <Select
                    value={formData.ticket_type_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, ticket_type_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a ticket type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketTypes.map((ticket) => (
                        <SelectItem key={ticket.id} value={ticket.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{ticket.name}</span>
                            <span className="ml-2 font-semibold">
                              {ticket.price > 0 ? `₦${ticket.price.toLocaleString()}` : "Free"}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTicket && <p className="text-sm text-gray-600 mt-1">{selectedTicket.description}</p>}
                </div>
              )}

              {/* Custom Fields */}
              {event.custom_fields && event.custom_fields.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  {event.custom_fields.map((field: any) => (
                    <div key={field.id}>
                      <Label htmlFor={field.id}>
                        {field.label} {field.required && "*"}
                      </Label>
                      {field.type === "text" && (
                        <Input
                          id={field.id}
                          value={formData.custom_field_responses[field.id] || ""}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          required={field.required}
                        />
                      )}
                      {field.type === "textarea" && (
                        <Textarea
                          id={field.id}
                          value={formData.custom_field_responses[field.id] || ""}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          required={field.required}
                        />
                      )}
                      {field.type === "select" && (
                        <Select
                          value={formData.custom_field_responses[field.id] || ""}
                          onValueChange={(value) => handleCustomFieldChange(field.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" disabled={submitting} className="w-full bg-[#3A00C1] hover:bg-[#3A00C1]/90">
                {submitting ? "Registering..." : "Register for Event"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
