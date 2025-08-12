"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { EventFormData } from "../event-creation-wizard"

interface SettingsStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

export function SettingsStep({ formData, updateFormData }: SettingsStepProps) {
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Event Settings</h3>
        <p className="text-sm text-gray-600">Configure additional settings for your event</p>
      </div>

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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Settings Summary</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Capacity: {formData.maxCapacity || "Unlimited"}</li>
          <li>• Approval: {formData.requiresApproval ? "Required" : "Automatic"}</li>
          <li>• Guest Registration: {formData.allowGuestRegistration ? "Allowed" : "Account Required"}</li>
          <li>• Custom Fields: {formData.customFields.length}</li>
        </ul>
      </div>
    </div>
  )
}
