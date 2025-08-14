"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Ticket, Plus, Edit, Trash2, Users, DollarSign, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"

// Mock ticket types data
const mockTicketTypes = [
  {
    id: "1",
    name: "VIP Pass",
    eventTitle: "Tech Conference 2024",
    eventId: "1",
    price: 25000,
    totalQuantity: 50,
    soldQuantity: 35,
    status: "active",
    description: "Premium access with networking dinner",
  },
  {
    id: "2",
    name: "Regular Ticket",
    eventTitle: "Tech Conference 2024",
    eventId: "1",
    price: 15000,
    totalQuantity: 200,
    soldQuantity: 180,
    status: "active",
    description: "Standard conference access",
  },
  {
    id: "3",
    name: "Student Discount",
    eventTitle: "Tech Conference 2024",
    eventId: "1",
    price: 10000,
    totalQuantity: 100,
    soldQuantity: 45,
    status: "active",
    description: "Discounted rate for students",
  },
  {
    id: "4",
    name: "Early Bird",
    eventTitle: "Marketing Workshop",
    eventId: "2",
    price: 12000,
    totalQuantity: 30,
    soldQuantity: 30,
    status: "sold_out",
    description: "Limited early bird pricing",
  },
]

const mockStats = {
  totalTicketTypes: 12,
  activeTickets: 8,
  soldOut: 2,
  totalRevenue: 3250000,
}

export default function TicketsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
  })

  const handleCreateTicket = () => {
    // Handle ticket creation
    console.log("Creating ticket:", newTicket)
    setIsCreateDialogOpen(false)
    setNewTicket({ name: "", price: "", quantity: "", description: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600">Manage your event ticket types and sales</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ticket Type</DialogTitle>
              <DialogDescription>Add a new ticket type for your events</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Ticket Name</Label>
                <Input
                  id="name"
                  value={newTicket.name}
                  onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                  placeholder="e.g., VIP Pass, Early Bird"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTicket.price}
                  onChange={(e) => setNewTicket({ ...newTicket, price: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Total Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newTicket.quantity}
                  onChange={(e) => setNewTicket({ ...newTicket, quantity: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Brief description of what's included"
                />
              </div>
              <Button onClick={handleCreateTicket} className="w-full">
                Create Ticket Type
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ticket Types</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalTicketTypes}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockStats.activeTickets}</div>
            <p className="text-xs text-muted-foreground">Currently selling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold Out</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockStats.soldOut}</div>
            <p className="text-xs text-muted-foreground">No longer available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{mockStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From ticket sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Types */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Types</CardTitle>
          <CardDescription>Manage your event ticket types and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTicketTypes.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium">{ticket.name}</h4>
                    <Badge
                      variant={
                        ticket.status === "active"
                          ? "default"
                          : ticket.status === "sold_out"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{ticket.description}</p>
                  <p className="text-sm text-gray-500">{ticket.eventTitle}</p>
                </div>
                <div className="text-right mr-6">
                  <p className="font-medium text-lg">₦{ticket.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    {ticket.soldQuantity}/{ticket.totalQuantity} sold
                  </p>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(ticket.soldQuantity / ticket.totalQuantity) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/dashboard/attendees/${ticket.eventId}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
