"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Upload, Eye, ImageIcon } from "lucide-react"
import type { EventFormData } from "../event-creation-wizard"

interface GetDPTemplateStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

const dynamicTextOptions = [
  { key: "{{name}}", label: "Attendee Name", example: "John Doe" },
  { key: "{{event_title}}", label: "Event Title", example: "Tech Conference 2024" },
  { key: "{{price}}", label: "Ticket Price", example: "₦5,000" },
  { key: "{{date}}", label: "Event Date", example: "March 15, 2024" },
  { key: "{{location}}", label: "Event Location", example: "Lagos, Nigeria" },
  { key: "{{ticket_type}}", label: "Ticket Type", example: "VIP Access" },
]

const fontOptions = [
  { value: "inter", label: "Inter", style: "font-sans" },
  { value: "playfair", label: "Playfair Display", style: "font-serif" },
  { value: "roboto", label: "Roboto", style: "font-sans" },
  { value: "montserrat", label: "Montserrat", style: "font-sans" },
  { value: "poppins", label: "Poppins", style: "font-sans" },
  { value: "dancing-script", label: "Dancing Script", style: "font-serif" },
]

export function GetDPTemplateStep({ formData, updateFormData }: GetDPTemplateStepProps): React.ReactElement {
  const [templateImage, setTemplateImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState<"photo" | "text" | "resize" | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateGetDPTemplate = (updates: Partial<EventFormData["getdpTemplate"]>) => {
    updateFormData({
      getdpTemplate: {
        ...formData.getdpTemplate,
        ...updates,
      },
    })
  }

  const handleTemplateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setTemplateImage(imageUrl)
        updateGetDPTemplate({ templateImage: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const insertDynamicText = (textKey: string) => {
    const currentText = formData.getdpTemplate.customText || ""
    updateGetDPTemplate({ customText: currentText + textKey })
  }

  const handlePointerDown = (type: "photo" | "text" | "resize", event: React.PointerEvent) => {
    event.preventDefault()
    setIsDragging(type)

    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      if (type === "resize") {
        const photoRect = formData.getdpTemplate.photoPlaceholder
        setDragOffset({
          x: event.clientX - rect.left - photoRect.x - photoRect.width,
          y: event.clientY - rect.top - photoRect.y - photoRect.height,
        })
      } else {
        const currentPos =
          type === "photo" ? formData.getdpTemplate.photoPlaceholder : formData.getdpTemplate.namePlaceholder

        setDragOffset({
          x: event.clientX - rect.left - currentPos.x,
          y: event.clientY - rect.top - currentPos.y,
        })
      }
    }
  }

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isDragging || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()

      if (isDragging === "resize") {
        const newWidth = Math.max(50, event.clientX - rect.left - formData.getdpTemplate.photoPlaceholder.x)
        const newHeight = Math.max(50, event.clientY - rect.top - formData.getdpTemplate.photoPlaceholder.y)

        updateGetDPTemplate({
          photoPlaceholder: {
            ...formData.getdpTemplate.photoPlaceholder,
            width: Math.min(newWidth, rect.width - formData.getdpTemplate.photoPlaceholder.x),
            height: Math.min(newHeight, rect.height - formData.getdpTemplate.photoPlaceholder.y),
          },
        })
      } else {
        const newX = event.clientX - rect.left - dragOffset.x
        const newY = event.clientY - rect.top - dragOffset.y

        if (isDragging === "photo") {
          updateGetDPTemplate({
            photoPlaceholder: {
              ...formData.getdpTemplate.photoPlaceholder,
              x: Math.max(0, Math.min(newX, rect.width - formData.getdpTemplate.photoPlaceholder.width)),
              y: Math.max(0, Math.min(newY, rect.height - formData.getdpTemplate.photoPlaceholder.height)),
            },
          })
        } else if (isDragging === "text") {
          updateGetDPTemplate({
            namePlaceholder: {
              ...formData.getdpTemplate.namePlaceholder,
              x: Math.max(0, Math.min(newX, rect.width - 100)),
              y: Math.max(0, Math.min(newY, rect.height - 20)),
            },
          })
        }
      }
    },
    [isDragging, dragOffset, formData.getdpTemplate],
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handlePointerMove)
      document.addEventListener("pointerup", handlePointerUp)

      return () => {
        document.removeEventListener("pointermove", handlePointerMove)
        document.removeEventListener("pointerup", handlePointerUp)
      }
    }
  }, [isDragging, handlePointerMove, handlePointerUp])

  const renderPreviewText = (text: string) => {
    return text
      .replace(/\{\{name\}\}/g, "John Doe")
      .replace(/\{\{event_title\}\}/g, formData.title || "Your Event")
      .replace(/\{\{price\}\}/g, "₦5,000")
      .replace(/\{\{date\}\}/g, formData.startDate || "Event Date")
      .replace(/\{\{location\}\}/g, formData.venueName || formData.city || "Event Location")
      .replace(/\{\{ticket_type\}\}/g, "VIP Access")
  }

  return (
    <div className="space-y-6">
      {/* Enable GetDP Template */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Personalized Promo Flyer</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Let attendees create custom "I'm attending" flyers with their photo
              </p>
            </div>
            <Switch
              checked={formData.getdpTemplate.enabled}
              onCheckedChange={(enabled) => updateGetDPTemplate({ enabled })}
            />
          </div>
        </CardHeader>
      </Card>

      {formData.getdpTemplate.enabled && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Builder */}
          <div className="space-y-6">
            {/* Template Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload Your Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleTemplateUpload}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {templateImage ? "Change Template" : "Upload Template Image"}
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB. Recommended: 1080x1080px</p>
                </div>
              </CardContent>
            </Card>

            {/* Custom Text */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Custom Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Text Content</Label>
                  <Input
                    value={formData.getdpTemplate.customText || ""}
                    onChange={(e) => updateGetDPTemplate({ customText: e.target.value })}
                    placeholder="I'm attending {{event_title}}!"
                    className="min-h-[40px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dynamic Text Shortcuts</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {dynamicTextOptions.map((option) => (
                      <Button
                        key={option.key}
                        variant="outline"
                        size="sm"
                        onClick={() => insertDynamicText(option.key)}
                        className="justify-start text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Click to add dynamic text that will be replaced with actual attendee data
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select
                      value={formData.getdpTemplate.fontFamily || "inter"}
                      onValueChange={(value) => updateGetDPTemplate({ fontFamily: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <span className={font.style}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Input
                      type="number"
                      value={formData.getdpTemplate.namePlaceholder.fontSize || 24}
                      onChange={(e) =>
                        updateGetDPTemplate({
                          namePlaceholder: {
                            ...formData.getdpTemplate.namePlaceholder,
                            fontSize: Number(e.target.value) || 24,
                          },
                        })
                      }
                      min="12"
                      max="72"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.getdpTemplate.namePlaceholder.color || "#ffffff"}
                      onChange={(e) =>
                        updateGetDPTemplate({
                          namePlaceholder: {
                            ...formData.getdpTemplate.namePlaceholder,
                            color: e.target.value,
                          },
                        })
                      }
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      value={formData.getdpTemplate.namePlaceholder.color || "#ffffff"}
                      onChange={(e) =>
                        updateGetDPTemplate({
                          namePlaceholder: {
                            ...formData.getdpTemplate.namePlaceholder,
                            color: e.target.value,
                          },
                        })
                      }
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Photo Size Controls */}
                <div className="space-y-2">
                  <Label>Photo Size</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Width"
                      value={formData.getdpTemplate.photoPlaceholder.width}
                      onChange={(e) =>
                        updateGetDPTemplate({
                          photoPlaceholder: {
                            ...formData.getdpTemplate.photoPlaceholder,
                            width: Number(e.target.value) || 100,
                          },
                        })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Height"
                      value={formData.getdpTemplate.photoPlaceholder.height}
                      onChange={(e) =>
                        updateGetDPTemplate({
                          photoPlaceholder: {
                            ...formData.getdpTemplate.photoPlaceholder,
                            height: Number(e.target.value) || 100,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  ref={canvasRef}
                  className="aspect-square border rounded-lg overflow-hidden relative bg-gray-100 select-none"
                  style={{ maxWidth: "400px", margin: "0 auto", touchAction: "none" }}
                >
                  {templateImage ? (
                    <>
                      {/* Template Background */}
                      <img
                        src={templateImage || "/placeholder.svg"}
                        alt="Template"
                        className="w-full h-full object-cover pointer-events-none"
                        draggable={false}
                      />

                      <div
                        className="absolute border-2 border-dashed border-white bg-white/20 rounded-full flex items-center justify-center cursor-move touch-none"
                        style={{
                          left: `${formData.getdpTemplate.photoPlaceholder.x}px`,
                          top: `${formData.getdpTemplate.photoPlaceholder.y}px`,
                          width: `${formData.getdpTemplate.photoPlaceholder.width}px`,
                          height: `${formData.getdpTemplate.photoPlaceholder.height}px`,
                        }}
                        onPointerDown={(e) => handlePointerDown("photo", e)}
                      >
                        <ImageIcon className="w-6 h-6 text-white/70" />

                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 bg-white border border-gray-300 rounded-full cursor-se-resize"
                          onPointerDown={(e) => {
                            e.stopPropagation()
                            handlePointerDown("resize", e)
                          }}
                        />
                      </div>

                      {/* Enhanced Text Placeholder */}
                      {formData.getdpTemplate.customText && (
                        <div
                          className="absolute cursor-move font-bold text-center select-none touch-none"
                          style={{
                            left: `${formData.getdpTemplate.namePlaceholder.x}px`,
                            top: `${formData.getdpTemplate.namePlaceholder.y}px`,
                            fontSize: `${formData.getdpTemplate.namePlaceholder.fontSize}px`,
                            fontFamily: formData.getdpTemplate.fontFamily || "Inter",
                            color: formData.getdpTemplate.namePlaceholder.color || "#ffffff",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                          }}
                          onPointerDown={(e) => handlePointerDown("text", e)}
                        >
                          {renderPreviewText(formData.getdpTemplate.customText)}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                        <p>Upload a template to see preview</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Updated Instruction Text */}
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Drag elements to position them. Use the resize handle on the photo placeholder to adjust size.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
