"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, MessageSquare, Mail, Clock, Users, Eye, Copy } from "lucide-react"
import type { EventFormData } from "../event-creation-wizard"

interface PromotionalStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

const DYNAMIC_VARIABLES = [
  { key: "{name}", label: "Attendee Name", description: "The registered attendee's name" },
  { key: "{event_title}", label: "Event Title", description: "The name of your event" },
  { key: "{event_date}", label: "Event Date", description: "The date of your event" },
  { key: "{event_time}", label: "Event Time", description: "The start time of your event" },
  { key: "{location}", label: "Event Location", description: "Where the event is taking place" },
  { key: "{ticket_type}", label: "Ticket Type", description: "The type of ticket purchased" },
  { key: "{price}", label: "Ticket Price", description: "The price paid for the ticket" },
  { key: "{organizer_name}", label: "Organizer Name", description: "Your name as the organizer" },
  { key: "{registration_id}", label: "Registration ID", description: "Unique registration reference" },
  { key: "{event_url}", label: "Event URL", description: "Link to the event page" },
  { key: "{qr_code}", label: "QR Code", description: "QR code for the ticket" },
  { key: "{days_until_event}", label: "Days Until Event", description: "Number of days remaining" },
]

const REMINDER_TIMINGS = [
  { value: "15m", label: "15 minutes before" },
  { value: "30m", label: "30 minutes before" },
  { value: "1h", label: "1 hour before" },
  { value: "2h", label: "2 hours before" },
  { value: "3h", label: "3 hours before" },
  { value: "6h", label: "6 hours before" },
  { value: "12h", label: "12 hours before" },
  { value: "24h", label: "24 hours before" },
  { value: "48h", label: "48 hours before" },
  { value: "72h", label: "3 days before" },
  { value: "1w", label: "1 week before" },
  { value: "2w", label: "2 weeks before" },
]

export function PromotionalStep({ formData, updateFormData }: PromotionalStepProps) {
  const [newField, setNewField] = useState({
    label: "",
    type: "text" as "text" | "email" | "phone" | "select",
    required: false,
    options: [] as string[],
  })
  const [activeMessageType, setActiveMessageType] = useState<"whatsapp" | "email">("whatsapp")
  const [activeTemplate, setActiveTemplate] = useState<"confirmation" | "reminder">("confirmation")
  const [showPreview, setShowPreview] = useState(false)

  const insertVariable = (
    variable: string,
    messageType: "whatsapp" | "email",
    templateType: "confirmation" | "reminder",
  ) => {
    if (messageType === "whatsapp") {
      const currentMessage =
        templateType === "confirmation"
          ? formData.whatsappMessages?.confirmation || ""
          : formData.whatsappMessages?.reminder || ""

      const updatedMessage = currentMessage + variable

      updateFormData({
        whatsappMessages: {
          ...formData.whatsappMessages,
          [templateType]: updatedMessage,
        },
      })
    } else {
      if (templateType === "confirmation") {
        const currentBody = formData.emailMessages?.body || ""
        updateFormData({
          emailMessages: {
            ...formData.emailMessages,
            body: currentBody + variable,
          },
        })
      }
    }
  }

  const previewMessage = (template: string) => {
    return template
      .replace(/{name}/g, "John Doe")
      .replace(/{event_title}/g, formData.title || "Your Event")
      .replace(/{event_date}/g, formData.startDate || "Event Date")
      .replace(/{event_time}/g, formData.startTime || "Event Time")
      .replace(/{location}/g, formData.location || "Event Location")
      .replace(/{ticket_type}/g, "General Admission")
      .replace(/{price}/g, "₦5,000")
      .replace(/{organizer_name}/g, "Event Organizer")
      .replace(/{registration_id}/g, "REG-12345")
      .replace(/{days_until_event}/g, "3")
  }

  const addCustomField = () => {
    if (!newField.label) return

    const customField = {
      id: Date.now().toString(),
      ...newField,
    }

    updateFormData({
      customFields: [...formData.customFields, customField],
    })

    setNewField({
      label: "",
      type: "text",
      required: false,
      options: [],
    })
  }

  const removeCustomField = (id: string) => {
    updateFormData({
      customFields: formData.customFields.filter((field) => field.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Promotional Settings</h3>
        <p className="text-sm text-gray-600">Configure promotional messages and registration settings</p>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Registration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          {/* Dynamic Variables Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dynamic Variables</CardTitle>
              <p className="text-sm text-gray-600">Click any variable to insert it into your message templates</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {DYNAMIC_VARIABLES.map((variable) => (
                  <Button
                    key={variable.key}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable.key, activeMessageType, activeTemplate)}
                    className="justify-start text-xs h-8"
                    title={variable.description}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {variable.key}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Messages */}
          {formData.promotionChannels?.includes("whatsapp") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  WhatsApp Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs
                  defaultValue="confirmation"
                  onValueChange={(value) => {
                    setActiveMessageType("whatsapp")
                    setActiveTemplate(value as "confirmation" | "reminder")
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
                    <TabsTrigger value="reminder">Reminder</TabsTrigger>
                  </TabsList>

                  <TabsContent value="confirmation" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Registration Confirmation Message</Label>
                        <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                      <Textarea
                        value={formData.whatsappMessages?.confirmation || ""}
                        onChange={(e) =>
                          updateFormData({
                            whatsappMessages: {
                              ...formData.whatsappMessages,
                              confirmation: e.target.value,
                            },
                          })
                        }
                        placeholder="Hi {name}! 🎉 Thanks for registering for {event_title}. Your {ticket_type} ticket is confirmed for {event_date} at {event_time}. Location: {location}. See you there!"
                        rows={4}
                        className="resize-none"
                      />
                      {showPreview && formData.whatsappMessages?.confirmation && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-medium text-green-800 mb-1">Preview:</p>
                          <p className="text-sm text-green-700">
                            {previewMessage(formData.whatsappMessages.confirmation)}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="reminder" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Event Reminder Message</Label>
                        <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                      <Textarea
                        value={formData.whatsappMessages?.reminder || ""}
                        onChange={(e) =>
                          updateFormData({
                            whatsappMessages: {
                              ...formData.whatsappMessages,
                              reminder: e.target.value,
                            },
                          })
                        }
                        placeholder="⏰ Reminder: {event_title} is in {days_until_event} days! Don't forget - {event_date} at {event_time}. Location: {location}. We can't wait to see you there!"
                        rows={4}
                        className="resize-none"
                      />
                      {showPreview && formData.whatsappMessages?.reminder && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-medium text-green-800 mb-1">Preview:</p>
                          <p className="text-sm text-green-700">{previewMessage(formData.whatsappMessages.reminder)}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Email Messages */}
          {formData.promotionChannels?.includes("email") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Email Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Subject Line</Label>
                  <Input
                    value={formData.emailMessages?.subject || ""}
                    onChange={(e) =>
                      updateFormData({
                        emailMessages: {
                          ...formData.emailMessages,
                          subject: e.target.value,
                        },
                      })
                    }
                    placeholder="🎟️ Your ticket for {event_title} is confirmed!"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Email Body</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveMessageType("email")
                        setActiveTemplate("confirmation")
                        setShowPreview(!showPreview)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                  <Textarea
                    value={formData.emailMessages?.body || ""}
                    onChange={(e) =>
                      updateFormData({
                        emailMessages: {
                          ...formData.emailMessages,
                          body: e.target.value,
                        },
                      })
                    }
                    placeholder="Dear {name},

Thank you for registering for {event_title}! 

Event Details:
📅 Date: {event_date}
⏰ Time: {event_time}
📍 Location: {location}
🎫 Ticket Type: {ticket_type}
💰 Price: {price}

Your registration ID is: {registration_id}

We're excited to see you there!

Best regards,
{organizer_name}"
                    rows={8}
                    className="resize-none font-mono text-sm"
                  />
                  {showPreview && formData.emailMessages?.body && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-2">Preview:</p>
                      <div className="text-sm text-blue-700 whitespace-pre-line">
                        {previewMessage(formData.emailMessages.body)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Message Automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send Confirmation Messages</Label>
                  <p className="text-sm text-gray-500">Automatically send confirmation after registration</p>
                </div>
                <Switch
                  checked={formData.autoSendConfirmation}
                  onCheckedChange={(checked) => updateFormData({ autoSendConfirmation: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send Event Reminders</Label>
                  <p className="text-sm text-gray-500">Send reminder messages before the event</p>
                </div>
                <Switch
                  checked={formData.autoSendReminders}
                  onCheckedChange={(checked) => updateFormData({ autoSendReminders: checked })}
                />
              </div>

              {formData.autoSendReminders && (
                <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-6">
                  <div className="space-y-2">
                    <Label>Primary Reminder Timing</Label>
                    <Select
                      value={formData.reminderTiming || "24h"}
                      onValueChange={(value) => updateFormData({ reminderTiming: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REMINDER_TIMINGS.map((timing) => (
                          <SelectItem key={timing.value} value={timing.value}>
                            {timing.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Send Multiple Reminders</Label>
                      <p className="text-sm text-gray-500">Send additional reminders at different intervals</p>
                    </div>
                    <Switch
                      checked={formData.multipleReminders || false}
                      onCheckedChange={(checked) => updateFormData({ multipleReminders: checked })}
                    />
                  </div>

                  {formData.multipleReminders && (
                    <div className="space-y-3 pl-4 border-l border-gray-100">
                      <Label className="text-sm">Additional Reminder Times</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["1w", "48h", "3h"].map((timing) => {
                          const isSelected = formData.additionalReminders?.includes(timing)
                          return (
                            <Button
                              key={timing}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const current = formData.additionalReminders || []
                                const updated = isSelected ? current.filter((t) => t !== timing) : [...current, timing]
                                updateFormData({ additionalReminders: updated })
                              }}
                            >
                              {REMINDER_TIMINGS.find((t) => t.value === timing)?.label}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registration" className="space-y-6">
          {/* Capacity Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Capacity & Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Maximum Capacity</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => updateFormData({ maxCapacity: Number(e.target.value) })}
                  placeholder="0 for unlimited"
                />
                <p className="text-xs text-gray-500">Set to 0 for unlimited capacity</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Approval</Label>
                  <p className="text-sm text-gray-500">Manually approve each registration</p>
                </div>
                <Switch
                  checked={formData.requiresApproval}
                  onCheckedChange={(checked) => updateFormData({ requiresApproval: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Guest Registration</Label>
                  <p className="text-sm text-gray-500">Let people register without creating an account</p>
                </div>
                <Switch
                  checked={formData.allowGuestRegistration}
                  onCheckedChange={(checked) => updateFormData({ allowGuestRegistration: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Custom Registration Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.customFields.length > 0 && (
                <div className="space-y-3">
                  {formData.customFields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{field.label}</p>
                        <p className="text-sm text-gray-500">
                          Type: {field.type} • {field.required ? "Required" : "Optional"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium">Add Custom Field</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Field Label</Label>
                    <Input
                      value={newField.label}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                      placeholder="e.g., Dietary Requirements"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field Type</Label>
                    <Select
                      value={newField.type}
                      onValueChange={(value: "text" | "email" | "phone" | "select") =>
                        setNewField({ ...newField, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="select">Select Dropdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Required Field</Label>
                  <Switch
                    checked={newField.required}
                    onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                  />
                </div>

                <Button onClick={addCustomField} disabled={!newField.label} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Field
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
