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
import { Plus, Trash2, MessageSquare, Mail, Clock, Users } from "lucide-react"
import type { EventFormData } from "../event-creation-wizard"

interface PromotionalStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

export function PromotionalStep({ formData, updateFormData }: PromotionalStepProps) {
  const [newField, setNewField] = useState({
    label: "",
    type: "text" as "text" | "email" | "phone" | "select",
    required: false,
    options: [] as string[],
  })

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
          {/* WhatsApp Messages */}
          {formData.promotionChannels?.includes("whatsapp") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  WhatsApp Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Registration Confirmation Message</Label>
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
                    placeholder="Hi {name}! Thanks for registering for {event_title}. Your ticket is confirmed for {event_date}."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Event Reminder Message</Label>
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
                    placeholder="Don't forget! {event_title} is tomorrow at {event_time}. See you there!"
                    rows={3}
                  />
                </div>
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
                    placeholder="Your ticket for {event_title} is confirmed!"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Body</Label>
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
                    placeholder="Dear {name}, Thank you for registering for {event_title}..."
                    rows={6}
                  />
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
            <CardContent className="space-y-4">
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
                <div className="ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
                  <div className="space-y-2">
                    <Label>Reminder Timing</Label>
                    <Select
                      value={formData.reminderTiming || "24h"}
                      onValueChange={(value) => updateFormData({ reminderTiming: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hour before</SelectItem>
                        <SelectItem value="3h">3 hours before</SelectItem>
                        <SelectItem value="24h">24 hours before</SelectItem>
                        <SelectItem value="48h">48 hours before</SelectItem>
                        <SelectItem value="1w">1 week before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
