"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Download, Search, Mail, Phone, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function EventAttendeesPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - in real app, fetch specific event attendees
  const eventData = {
    id: eventId,
    title: "Tech Conference 2024",
    date: "2024-03-15",
    totalAttendees: 150,
  }

  const attendees = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+234 801 234 5678",
      ticketType: "VIP",
      registrationDate: "2024-02-15",
      status: "confirmed",
      amount: "₦5,000",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+234 802 345 6789",
      ticketType: "Regular",
      registrationDate: "2024-02-18",
      status: "confirmed",
      amount: "₦2,000",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+234 803 456 7890",
      ticketType: "Student",
      registrationDate: "2024-02-20",
      status: "pending",
      amount: "₦1,000",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+234 804 567 8901",
      ticketType: "VIP",
      registrationDate: "2024-02-22",
      status: "confirmed",
      amount: "₦5,000",
    },
    {
      id: "5",
      name: "David Brown",
      email: "david@example.com",
      phone: "+234 805 678 9012",
      ticketType: "Regular",
      registrationDate: "2024-02-25",
      status: "confirmed",
      amount: "₦2,000",
    },
  ]

  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    confirmed: attendees.filter((a) => a.status === "confirmed").length,
    pending: attendees.filter((a) => a.status === "pending").length,
    vip: attendees.filter((a) => a.ticketType === "VIP").length,
    regular: attendees.filter((a) => a.ticketType === "Regular").length,
    student: attendees.filter((a) => a.ticketType === "Student").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/analytics">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analytics
          </Link>
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Event Attendees</h2>
        <p className="text-muted-foreground">
          {eventData.title} - {eventData.totalAttendees} registered
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventData.totalAttendees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Tickets</CardTitle>
            <Badge variant="secondary">VIP</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vip}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regular</CardTitle>
            <Badge variant="outline">REG</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.regular}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student</CardTitle>
            <Badge variant="outline">STU</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.student}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Attendee List</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-3">
              {filteredAttendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">{attendee.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {attendee.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {attendee.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Badge variant={attendee.ticketType === "VIP" ? "default" : "outline"}>
                        {attendee.ticketType}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{attendee.amount}</div>
                      <div className="text-xs text-muted-foreground">Amount</div>
                    </div>
                    <div className="text-center">
                      <Badge variant={attendee.status === "confirmed" ? "secondary" : "outline"}>
                        {attendee.status}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm">{attendee.registrationDate}</div>
                      <div className="text-xs text-muted-foreground">Registered</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button asChild>
          <Link href={`/dashboard/analytics/${eventId}`}>
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/events">
            <Calendar className="h-4 w-4 mr-2" />
            Manage Event
          </Link>
        </Button>
      </div>
    </div>
  )
}
