"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { EventFormData } from "../event-creation-wizard"

interface BasicInfoStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

const categories = [
  "Business & Professional",
  "Food & Drink",
  "Health & Wellness",
  "Music & Entertainment",
  "Arts & Culture",
  "Sports & Fitness",
  "Technology",
  "Education",
  "Community & Social",
  "Religion & Spirituality",
  "Family & Kids",
  "Fashion & Beauty",
  "Travel & Outdoor",
  "Other",
]

const timezones = [
  { value: "Africa/Lagos", label: "West Africa Time (WAT)" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
]

export function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    updateFormData({
      title,
      slug: generateSlug(title),
    })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            Event Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter your event title"
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Event Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe your event in detail..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.category} onValueChange={(value) => updateFormData({ category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Event URL Slug</Label>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">ticket.com/events/</span>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => updateFormData({ slug: e.target.value })}
              placeholder="event-url-slug"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => updateFormData({ metaDescription: e.target.value })}
            placeholder="Brief description for search engines..."
            rows={2}
            maxLength={160}
          />
          <p className="text-xs text-gray-500">{formData.metaDescription.length}/160 characters</p>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Date & Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {formData.startDate && formData.endDate && formData.startTime && formData.endTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Event Duration</h4>
              <p className="text-sm text-blue-700">
                Your event will run from {formData.startDate} at {formData.startTime} to {formData.endDate} at{" "}
                {formData.endTime}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Event Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Event Type</Label>
            <RadioGroup
              value={formData.eventType}
              onValueChange={(value: "free" | "paid" | "donation") => updateFormData({ eventType: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">Free Event</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid">Paid Event</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="donation" id="donation" />
                <Label htmlFor="donation">Donation Based</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Additional Features</h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Promotions</Label>
                <p className="text-sm text-gray-500">Send promotional messages via WhatsApp and Email</p>
              </div>
              <Switch
                checked={formData.enablePromotions}
                onCheckedChange={(checked) => updateFormData({ enablePromotions: checked })}
              />
            </div>

            {formData.enablePromotions && (
              <div className="ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="whatsapp"
                      checked={formData.promotionChannels?.includes("whatsapp")}
                      onChange={(e) => {
                        const channels = formData.promotionChannels || []
                        if (e.target.checked) {
                          updateFormData({ promotionChannels: [...channels, "whatsapp"] })
                        } else {
                          updateFormData({ promotionChannels: channels.filter((c) => c !== "whatsapp") })
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="email"
                      checked={formData.promotionChannels?.includes("email")}
                      onChange={(e) => {
                        const channels = formData.promotionChannels || []
                        if (e.target.checked) {
                          updateFormData({ promotionChannels: [...channels, "email"] })
                        } else {
                          updateFormData({ promotionChannels: channels.filter((c) => c !== "email") })
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="email">Email</Label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Personalized Promo Flyers</Label>
                <p className="text-sm text-gray-500">Let attendees create custom promotional flyers</p>
              </div>
              <Switch
                checked={formData.enableGetDP}
                onCheckedChange={(checked) => updateFormData({ enableGetDP: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
