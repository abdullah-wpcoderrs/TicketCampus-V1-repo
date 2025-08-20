"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Ticket, Plus, Edit, Trash2, Users, DollarSign, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"

interface TicketStats {
  totalTicketTypes: number
  totalSold: number
  totalRevenue: number
  activeTypes: number
}

interface TicketType {
  id: string
  name: string
  event: string
  price: number
  sold: number
  capacity: number
  status: string
  description: string
}

export default function TicketsPage() {
  const { user } = useAuth()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState("all")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<TicketStats>({
    totalTicketTypes: 0,
    totalSold: 0,
    totalRevenue: 0,
    activeTypes: 0,
  })
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [events, setEvents] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      fetchTicketsData()
    }
  }, [user])

  const fetchTicketsData = async () => {
    try {
      // Fetch ticket stats
      const statsResponse = await fetch(`/api/tickets/stats?userId=${user?.id}`)
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch ticket types
      const typesResponse = await fetch(`/api/tickets/types?userId=${user?.id}`)
      if (typesResponse.ok) {
        const typesData = await typesResponse.json()
        setTicketTypes(typesData.ticketTypes || [])

        // Extract unique event names
        const uniqueEvents = [...new Set(typesData.ticketTypes?.map((t: TicketType) => t.event) || [])] as string[]
        setEvents(uniqueEvents)
      }
    } catch (error) {
      console.error('Error fetching tickets data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTicketTypes = selectedEvent === "all"
    ? ticketTypes
    : ticketTypes.filter(ticket => ticket.event === selectedEvent)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
          <p className="text-muted-foreground">Loading tickets data...</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  const [newTicket, setNewTicket] = useState({
    name: "",
    price: "",
    quantity: "",
    description: ""
  })

  const handleCreateTicket = async () => {
    try {
      const response = await fetch('/api/tickets/types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTicket.name,
          price: parseFloat(newTicket.price),
          capacity: parseInt(newTicket.quantity),
          description: newTicket.description
        })
      })
      
      if (response.ok) {
        setIsCreateDialogOpen(false)
        setNewTicket({ name: "", price: "", quantity: "", description: "" })
        fetchTicketsData() // Refresh data
      }
    } catch (error) {
      console.error('Error creating ticket type:', error)
    }
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
            <div className="text-2xl font-bold">{stats.totalTicketTypes}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeTypes}</div>
            <p className="text-xs text-muted-foreground">Currently selling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold Out</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalTicketTypes - stats.activeTypes}</div>
            <p className="text-xs text-muted-foreground">No longer available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
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
            <div className="flex items-center justify-between mb-4">
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event} value={event}>{event}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filteredTicketTypes.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ticket types yet</h3>
                <p className="text-gray-600 mb-4">Create ticket types for your events to start selling</p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Ticket Type
                </Button>
              </div>
            ) : (
              filteredTicketTypes.map((ticket) => (
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
                  <p className="text-sm text-gray-500">{ticket.event}</p>
                </div>
                <div className="text-right mr-6">
                  <p className="font-medium text-lg">₦{ticket.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    {ticket.sold}/{ticket.capacity} sold
                  </p>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(ticket.sold / ticket.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/dashboard/attendees`}>
                    <Button variant="ghost" size="sm">
                      <Users className="w-4 h-4" />
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
