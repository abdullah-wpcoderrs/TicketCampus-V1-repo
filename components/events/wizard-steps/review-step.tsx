"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Ticket, Settings, ImageIcon } from "lucide-react"
import type { EventFormData } from "../event-creation-wizard"

interface ReviewStepProps {
  formData: EventFormData
}

export function ReviewStep({ formData }: ReviewStepProps) {
  const formatDate = (date: string, time: string) => {
    if (!date || !time) return "Not set"
    return new Date(`${date}T${time}`).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Review Your Event</h3>
        <p className="text-sm text-gray-600">Please review all details before creating your event</p>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-medium text-lg">{formData.title || "Untitled Event"}</h4>
            <Badge variant={formData.eventType === "free" ? "secondary" : "default"} className="mt-1">
              {formData.eventType.charAt(0).toUpperCase() + formData.eventType.slice(1)} Event
            </Badge>
          </div>
          <p className="text-gray-600">{formData.description || "No description provided"}</p>
          <p className="text-sm text-gray-500">Category: {formData.category || "Not selected"}</p>
          <p className="text-sm text-gray-500">URL: theplace.com/events/{formData.slug || "event-slug"}</p>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Start</p>
              <p className="text-gray-600">{formatDate(formData.startDate, formData.startTime)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">End</p>
              <p className="text-gray-600">{formatDate(formData.endDate, formData.endTime)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Timezone: {formData.timezone}</p>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.isOnline ? (
            <div>
              <Badge variant="outline">Online Event</Badge>
              <p className="text-gray-600 mt-2">{formData.meetingLink || "Meeting link not provided"}</p>
            </div>
          ) : (
            <div>
              <Badge variant="outline">Physical Location</Badge>
              <div className="mt-2 space-y-1">
                <p className="font-medium">{formData.venueName || "Venue not specified"}</p>
                <p className="text-gray-600">{formData.venueAddress || "Address not provided"}</p>
                <p className="text-sm text-gray-500">
                  {[formData.city, formData.state, formData.country].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" />
            Media
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">Banner Image: {formData.bannerImage ? "✓ Uploaded" : "Not uploaded"}</p>
            <p className="text-sm">Gallery Images: {formData.galleryImages.length} image(s)</p>
          </div>
        </CardContent>
      </Card>

      {/* Tickets */}
      {formData.eventType !== "free" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.ticketTypes.length > 0 ? (
              <div className="space-y-3">
                {formData.ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{ticket.name}</h5>
                      <span className="font-medium">₦{ticket.price.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{ticket.description}</p>
                    <p className="text-xs text-gray-500">Quantity: {ticket.quantity}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No ticket types created</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>Capacity: {formData.maxCapacity || "Unlimited"}</p>
            <p>Approval Required: {formData.requiresApproval ? "Yes" : "No"}</p>
            <p>Guest Registration: {formData.allowGuestRegistration ? "Allowed" : "Account Required"}</p>
            <p>Custom Fields: {formData.customFields.length}</p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Ready to Create</h4>
        <p className="text-sm text-green-700">
          Your event is ready to be created. Click "Create Event" to publish it and start accepting registrations.
        </p>
      </div>
    </div>
  )
}
