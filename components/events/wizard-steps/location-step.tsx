"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EventFormData } from "../event-creation-wizard"

interface LocationStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
]

export function LocationStep({ formData, updateFormData }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Event Location Type</Label>
        <RadioGroup
          value={formData.isOnline ? "online" : "physical"}
          onValueChange={(value) => updateFormData({ isOnline: value === "online" })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="physical" id="physical" />
            <Label htmlFor="physical">Physical Location</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">Online Event</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.isOnline ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meetingLink">
              Meeting Link <span className="text-red-500">*</span>
            </Label>
            <Input
              id="meetingLink"
              value={formData.meetingLink}
              onChange={(e) => updateFormData({ meetingLink: e.target.value })}
              placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-def-ghi"
            />
            <p className="text-xs text-gray-500">Provide the link where attendees will join your online event</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="venueName">
              Venue Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="venueName"
              value={formData.venueName}
              onChange={(e) => updateFormData({ venueName: e.target.value })}
              placeholder="e.g., Lagos Continental Hotel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueAddress">
              Venue Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="venueAddress"
              value={formData.venueAddress}
              onChange={(e) => updateFormData({ venueAddress: e.target.value })}
              placeholder="e.g., 52A Kofo Abayomi Street, Victoria Island"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                placeholder="e.g., Lagos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => updateFormData({ state: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => updateFormData({ country: e.target.value })}
              placeholder="Nigeria"
            />
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Location Summary</h4>
        <p className="text-sm text-green-700">
          {formData.isOnline ? (
            formData.meetingLink ? (
              <>This is an online event. Attendees will join via: {formData.meetingLink}</>
            ) : (
              "Please provide a meeting link for your online event."
            )
          ) : (
            <>
              {formData.venueName && formData.venueAddress ? (
                <>
                  This event will be held at {formData.venueName}, {formData.venueAddress}
                  {formData.city && `, ${formData.city}`}
                  {formData.state && `, ${formData.state}`}
                  {formData.country && `, ${formData.country}`}
                </>
              ) : (
                "Please provide venue details for your physical event."
              )}
            </>
          )}
        </p>
      </div>
    </div>
  )
}
