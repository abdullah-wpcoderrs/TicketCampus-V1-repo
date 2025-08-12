"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

      <div className="space-y-2">
        <Label htmlFor="slug">Event URL Slug</Label>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">theplace.com/events/</span>
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
  )
}
