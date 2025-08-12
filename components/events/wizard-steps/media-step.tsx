"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"
import type { EventFormData } from "../event-creation-wizard"

interface MediaStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

export function MediaStep({ formData, updateFormData }: MediaStepProps) {
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateFormData({ bannerImage: file })
      const reader = new FileReader()
      reader.onload = (e) => setBannerPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const newImages = [...formData.galleryImages, ...files].slice(0, 5) // Max 5 images
      updateFormData({ galleryImages: newImages })

      // Create previews
      const newPreviews: string[] = []
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string)
          if (newPreviews.length === files.length) {
            setGalleryPreviews((prev) => [...prev, ...newPreviews].slice(0, 5))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeBanner = () => {
    updateFormData({ bannerImage: null })
    setBannerPreview(null)
  }

  const removeGalleryImage = (index: number) => {
    const newImages = formData.galleryImages.filter((_, i) => i !== index)
    const newPreviews = galleryPreviews.filter((_, i) => i !== index)
    updateFormData({ galleryImages: newImages })
    setGalleryPreviews(newPreviews)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Event Banner Image</Label>
          <p className="text-sm text-gray-500 mb-3">
            Upload a high-quality banner image for your event (recommended: 1200x600px)
          </p>
        </div>

        {bannerPreview ? (
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={bannerPreview || "/placeholder.svg"}
                  alt="Banner preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeBanner}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 border-gray-300 hover:border-purple-400 transition-colors">
            <CardContent className="p-8">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="banner-upload" className="cursor-pointer">
                    <span className="text-purple-600 hover:text-purple-700 font-medium">
                      Click to upload banner image
                    </span>
                  </Label>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                </div>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label>Gallery Images (Optional)</Label>
          <p className="text-sm text-gray-500 mb-3">
            Add up to 5 additional images to showcase your event (max 5 images)
          </p>
        </div>

        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {galleryPreviews.map((preview, index) => (
              <Card key={index}>
                <CardContent className="p-2">
                  <div className="relative">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeGalleryImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {formData.galleryImages.length < 5 && (
          <Card className="border-dashed border-2 border-gray-300 hover:border-purple-400 transition-colors">
            <CardContent className="p-6">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <div className="space-y-2">
                  <Label htmlFor="gallery-upload" className="cursor-pointer">
                    <span className="text-purple-600 hover:text-purple-700 font-medium">Add gallery images</span>
                  </Label>
                  <p className="text-xs text-gray-500">{5 - formData.galleryImages.length} more images allowed</p>
                </div>
                <input
                  id="gallery-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Media Tips</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Use high-quality images that represent your event well</li>
          <li>• Banner image should be landscape orientation (16:9 ratio recommended)</li>
          <li>• Avoid images with too much text overlay</li>
          <li>• Gallery images help attendees understand what to expect</li>
        </ul>
      </div>
    </div>
  )
}
