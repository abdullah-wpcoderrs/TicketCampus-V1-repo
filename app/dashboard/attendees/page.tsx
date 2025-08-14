"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Download, Mail, Phone, Calendar } from "lucide-react"

// Mock attendees data
const mockAttendees = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 801 234 5678",
    eventTitle: "Tech Conference 2024",
    eventId: "1",
    ticketType: "VIP",
    registrationDate: "2024-03-01T10:00:00Z",
    status: "confirmed",
    amount: 25000,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+234 802 345 6789",
    eventTitle: "Marketing Workshop",
    eventId: "2",
    ticketType: "Regular",
    registrationDate: "2024-03-02T14:30:00Z",
    status: "confirmed",
    amount: 15000,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+234 803 456 7890",
    eventTitle: "Tech Conference 2024",
    eventId: "1",
    ticketType: "Student",
    registrationDate: "2024-03-03T09:15:00Z",
    status: "pending",
    amount: 10000,
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+234 804 567 8901",
    eventTitle: "Startup Pitch Night",
    eventId: "3",
    ticketType: "Free",
    registrationDate: "2024-03-04T16:45:00Z",
    status: "confirmed",
    amount: 0,
  },
]

const mockStats = {
  totalAttendees: 1247,
  confirmedAttendees: 1180,
  pendingAttendees: 67,
  totalRevenue: 18750000,
}

export default function AttendeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState("all")

  const filteredAttendees = mockAttendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEvent = selectedEvent === "all" || attendee.eventId === selectedEvent
    return matchesSearch && matchesEvent
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendees</h1>
          <p className="text-gray-600">Manage all your event attendees</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalAttendees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockStats.confirmedAttendees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready to attend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mockStats.pendingAttendees}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{mockStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From registrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Attendees</CardTitle>
          <CardDescription>Search and filter your event attendees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Events</option>
              <option value="1">Tech Conference 2024</option>
              <option value="2">Marketing Workshop</option>
              <option value="3">Startup Pitch Night</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredAttendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-medium">
                      {attendee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{attendee.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {attendee.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {attendee.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant={attendee.status === "confirmed" ? "default" : "secondary"}>{attendee.status}</Badge>
                    <Badge variant="outline">{attendee.ticketType}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{attendee.eventTitle}</p>
                  <p className="font-medium">₦{attendee.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
