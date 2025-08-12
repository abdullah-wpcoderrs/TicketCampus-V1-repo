"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EventFormData } from "../event-creation-wizard"

interface DateTimeStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

const timezones = [
  { value: "Africa/Lagos", label: "West Africa Time (WAT)" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
]

export function DateTimeStep({ formData, updateFormData }: DateTimeStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => updateFormData({ startDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">
            Start Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => updateFormData({ startTime: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="endDate">
            End Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => updateFormData({ endDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">
            End Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => updateFormData({ endTime: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Select value={formData.timezone} onValueChange={(value) => updateFormData({ timezone: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Event Duration</h4>
        <p className="text-sm text-blue-700">
          {formData.startDate && formData.endDate && formData.startTime && formData.endTime ? (
            <>
              Your event will run from {formData.startDate} at {formData.startTime} to {formData.endDate} at{" "}
              {formData.endTime}
            </>
          ) : (
            "Please fill in all date and time fields to see the event duration."
          )}
        </p>
      </div>
    </div>
  )
}
