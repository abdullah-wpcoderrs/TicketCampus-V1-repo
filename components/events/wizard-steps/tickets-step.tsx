"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Ticket } from "lucide-react"
import type { EventFormData } from "../event-creation-wizard"

interface TicketsStepProps {
  formData: EventFormData
  updateFormData: (updates: Partial<EventFormData>) => void
}

export function TicketsStep({ formData, updateFormData }: TicketsStepProps) {
  const [newTicket, setNewTicket] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    saleStartDate: "",
    saleEndDate: "",
  })

  const addTicketType = () => {
    if (!newTicket.name) return

    const ticketType = {
      id: Date.now().toString(),
      ...newTicket,
    }

    updateFormData({
      ticketTypes: [...formData.ticketTypes, ticketType],
    })

    setNewTicket({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      saleStartDate: "",
      saleEndDate: "",
    })
  }

  const removeTicketType = (id: string) => {
    updateFormData({
      ticketTypes: formData.ticketTypes.filter((ticket) => ticket.id !== id),
    })
  }

  const updateTicketType = (id: string, updates: any) => {
    updateFormData({
      ticketTypes: formData.ticketTypes.map((ticket) => (ticket.id === id ? { ...ticket, ...updates } : ticket)),
    })
  }

  if (formData.eventType === "free") {
    return (
      <div className="text-center py-8">
        <Ticket className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Free Event</h3>
        <p className="text-gray-600">Your event is set as free. Attendees can register without payment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ticket Types</h3>
        <p className="text-sm text-gray-600">Create different ticket types with varying prices and availability</p>
      </div>

      {/* Existing Ticket Types */}
      {formData.ticketTypes.length > 0 && (
        <div className="space-y-4">
          {formData.ticketTypes.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{ticket.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTicketType(ticket.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ticket Name</Label>
                    <Input
                      value={ticket.name}
                      onChange={(e) => updateTicketType(ticket.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (₦)</Label>
                    <Input
                      type="number"
                      value={ticket.price}
                      onChange={(e) => updateTicketType(ticket.id, { price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={ticket.description}
                    onChange={(e) => updateTicketType(ticket.id, { description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity Available</Label>
                    <Input
                      type="number"
                      value={ticket.quantity}
                      onChange={(e) => updateTicketType(ticket.id, { quantity: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sale Start Date</Label>
                    <Input
                      type="date"
                      value={ticket.saleStartDate}
                      onChange={(e) => updateTicketType(ticket.id, { saleStartDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sale End Date</Label>
                    <Input
                      type="date"
                      value={ticket.saleEndDate}
                      onChange={(e) => updateTicketType(ticket.id, { saleEndDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Ticket Type */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add New Ticket Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ticket Name</Label>
              <Input
                value={newTicket.name}
                onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                placeholder="e.g., Early Bird, VIP, Regular"
              />
            </div>
            <div className="space-y-2">
              <Label>Price (₦)</Label>
              <Input
                type="number"
                value={newTicket.price}
                onChange={(e) => setNewTicket({ ...newTicket, price: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              placeholder="Describe what's included with this ticket..."
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Quantity Available</Label>
              <Input
                type="number"
                value={newTicket.quantity}
                onChange={(e) => setNewTicket({ ...newTicket, quantity: Number(e.target.value) })}
                placeholder="100"
              />
            </div>
            <div className="space-y-2">
              <Label>Sale Start Date</Label>
              <Input
                type="date"
                value={newTicket.saleStartDate}
                onChange={(e) => setNewTicket({ ...newTicket, saleStartDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Sale End Date</Label>
              <Input
                type="date"
                value={newTicket.saleEndDate}
                onChange={(e) => setNewTicket({ ...newTicket, saleEndDate: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={addTicketType} disabled={!newTicket.name} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Ticket Type
          </Button>
        </CardContent>
      </Card>

      {formData.eventType === "paid" && formData.ticketTypes.length === 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-2">Paid Event Requires Tickets</h4>
          <p className="text-sm text-orange-700">
            Since this is a paid event, you need to create at least one ticket type before proceeding.
          </p>
        </div>
      )}
    </div>
  )
}
