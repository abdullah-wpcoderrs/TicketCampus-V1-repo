"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Eye, Palette, Type, ImageIcon, Move } from "lucide-react"
import type { EventFormData } from "../event-creation-wizard"

interface GetDPTemplateStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

const templatePresets = [
  {
    id: "modern",
    name: "Modern Gradient",
    backgroundColor: "#3A00C1",
    textColor: "#FFFFFF",
    preview: "/placeholder.svg?height=300&width=200&text=Modern+Template",
  },
  {
    id: "minimal",
    name: "Clean Minimal",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    preview: "/placeholder.svg?height=300&width=200&text=Minimal+Template",
  },
  {
    id: "vibrant",
    name: "Vibrant Colors",
    backgroundColor: "#FF6B6B",
    textColor: "#FFFFFF",
    preview: "/placeholder.svg?height=300&width=200&text=Vibrant+Template",
  },
  {
    id: "professional",
    name: "Professional",
    backgroundColor: "#2C3E50",
    textColor: "#FFFFFF",
    preview: "/placeholder.svg?height=300&width=200&text=Professional+Template",
  },
]

export function GetDPTemplateStep({ formData, updateFormData }: GetDPTemplateStepProps) {
  const [activeTab, setActiveTab] = useState("design")
  const [isDragging, setIsDragging] = useState<string | null>(null)

  const updateGetDPTemplate = (updates: Partial<EventFormData["getdpTemplate"]>) => {
    updateFormData({
      getdpTemplate: {
        ...formData.getdpTemplate,
        ...updates,
      },
    })
  }

  const handleTemplateSelect = (template: (typeof templatePresets)[0]) => {
    updateGetDPTemplate({
      templateId: template.id,
      templateName: template.name,
      backgroundColor: template.backgroundColor,
      textColor: template.textColor,
    })
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      updateGetDPTemplate({ eventLogo: file })
    }
  }

  return (
    <div className="space-y-6">
      {/* Enable GetDP Template */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">GetDP Template</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Create personalized promotional flyers for your attendees</p>
            </div>
            <Switch
              checked={formData.getdpTemplate.enabled}
              onCheckedChange={(enabled) => updateGetDPTemplate({ enabled })}
            />
          </div>
        </CardHeader>
        {formData.getdpTemplate.enabled && (
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              When enabled, attendees will be able to create personalized "I'm attending" flyers with their photo and
              name after registering for your event.
            </div>
          </CardContent>
        )}
      </Card>

      {formData.getdpTemplate.enabled && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Builder */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center gap-2">
                  <Move className="w-4 h-4" />
                  Layout
                </TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Choose Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {templatePresets.map((template) => (
                        <div
                          key={template.id}
                          className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                            formData.getdpTemplate.templateId === template.id
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="aspect-[3/4] bg-gray-100 rounded mb-2 flex items-center justify-center">
                            <img
                              src={template.preview || "/placeholder.svg"}
                              alt={template.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <p className="text-sm font-medium text-center">{template.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={formData.getdpTemplate.backgroundColor}
                          onChange={(e) => updateGetDPTemplate({ backgroundColor: e.target.value })}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={formData.getdpTemplate.backgroundColor}
                          onChange={(e) => updateGetDPTemplate({ backgroundColor: e.target.value })}
                          placeholder="#3A00C1"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="textColor"
                          type="color"
                          value={formData.getdpTemplate.textColor}
                          onChange={(e) => updateGetDPTemplate({ textColor: e.target.value })}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={formData.getdpTemplate.textColor}
                          onChange={(e) => updateGetDPTemplate({ textColor: e.target.value })}
                          placeholder="#FFFFFF"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Event Logo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.getdpTemplate.eventLogo
                            ? formData.getdpTemplate.eventLogo.name
                            : "Click to upload event logo"}
                        </p>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Custom Text</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.getdpTemplate.customText}
                      onChange={(e) => updateGetDPTemplate({ customText: e.target.value })}
                      placeholder="I'm attending {eventTitle}!"
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Use {"{eventTitle}"} to insert the event name and {"{attendeeName}"} for the attendee's name
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Photo Placement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>X Position</Label>
                        <Input
                          type="number"
                          value={formData.getdpTemplate.photoPlaceholder.x}
                          onChange={(e) =>
                            updateGetDPTemplate({
                              photoPlaceholder: {
                                ...formData.getdpTemplate.photoPlaceholder,
                                x: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Y Position</Label>
                        <Input
                          type="number"
                          value={formData.getdpTemplate.photoPlaceholder.y}
                          onChange={(e) =>
                            updateGetDPTemplate({
                              photoPlaceholder: {
                                ...formData.getdpTemplate.photoPlaceholder,
                                y: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Width</Label>
                        <Input
                          type="number"
                          value={formData.getdpTemplate.photoPlaceholder.width}
                          onChange={(e) =>
                            updateGetDPTemplate({
                              photoPlaceholder: {
                                ...formData.getdpTemplate.photoPlaceholder,
                                width: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Height</Label>
                        <Input
                          type="number"
                          value={formData.getdpTemplate.photoPlaceholder.height}
                          onChange={(e) =>
                            updateGetDPTemplate({
                              photoPlaceholder: {
                                ...formData.getdpTemplate.photoPlaceholder,
                                height: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Name Placement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>X Position</Label>
                        <Input
                          type="number"
                          value={formData.getdpTemplate.namePlaceholder.x}
                          onChange={(e) =>
                            updateGetDPTemplate({
                              namePlaceholder: {
                                ...formData.getdpTemplate.namePlaceholder,
                                x: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Y Position</Label>
                        <Input
                          type="number"
                          value={formData.getdpTemplate.namePlaceholder.y}
                          onChange={(e) =>
                            updateGetDPTemplate({
                              namePlaceholder: {
                                ...formData.getdpTemplate.namePlaceholder,
                                y: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Font Size</Label>
                        <Input
                          type="number"
                          value={formData.getdpTemplate.namePlaceholder.fontSize}
                          onChange={(e) =>
                            updateGetDPTemplate({
                              namePlaceholder: {
                                ...formData.getdpTemplate.namePlaceholder,
                                fontSize: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] border rounded-lg overflow-hidden relative">
                  <div
                    className="w-full h-full flex flex-col items-center justify-center text-center p-4"
                    style={{
                      backgroundColor: formData.getdpTemplate.backgroundColor,
                      color: formData.getdpTemplate.textColor,
                    }}
                  >
                    {/* Event Logo */}
                    {formData.getdpTemplate.eventLogo && (
                      <div className="mb-4">
                        <ImageIcon className="w-12 h-12 opacity-50" />
                      </div>
                    )}

                    {/* Photo Placeholder */}
                    <div
                      className="bg-white/20 rounded-full flex items-center justify-center mb-4"
                      style={{
                        width: `${formData.getdpTemplate.photoPlaceholder.width}px`,
                        height: `${formData.getdpTemplate.photoPlaceholder.height}px`,
                      }}
                    >
                      <ImageIcon className="w-8 h-8 opacity-50" />
                    </div>

                    {/* Custom Text */}
                    <div className="mb-2">
                      <p className="font-semibold">
                        {formData.getdpTemplate.customText
                          .replace("{eventTitle}", formData.title || "Your Event")
                          .replace("{attendeeName}", "John Doe")}
                      </p>
                    </div>

                    {/* Event Details */}
                    <div className="text-sm opacity-80">
                      <p>{formData.startDate}</p>
                      <p>{formData.venueName || formData.city}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  This is how the personalized flyer will look for attendees
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
