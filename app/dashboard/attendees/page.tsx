"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, UserCheck, Clock, Download, Filter, Calendar, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"

interface AttendeeStats {
  totalAttendees: number
  confirmedAttendees: number
  pendingAttendees: number
  totalRevenue: number
}

interface Attendee {
  id: string
  name: string
  email: string
  phone: string
  event: string
  ticketType: string
  status: string
  registrationDate: string
  amount: number
}

export default function AttendeesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterEvent, setFilterEvent] = useState("all")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AttendeeStats>({
    totalAttendees: 0,
    confirmedAttendees: 0,
    pendingAttendees: 0,
    totalRevenue: 0,
  })
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [events, setEvents] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      fetchAttendeesData()
    }
  }, [user])

  const fetchAttendeesData = async () => {
    try {
      // Fetch attendee stats
      const statsResponse = await fetch(`/api/attendees/stats?userId=${user?.id}`)
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch attendees list
      const attendeesResponse = await fetch(`/api/attendees?userId=${user?.id}`)
      if (attendeesResponse.ok) {
        const attendeesData = await attendeesResponse.json()
        setAttendees(attendeesData.attendees || [])

        // Extract unique event names
        const uniqueEvents = [...new Set(attendeesData.attendees?.map((a: Attendee) => a.event) || [])] as string[]
        setEvents(uniqueEvents)
      }
    } catch (error) {
      console.error('Error fetching attendees data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || attendee.status === filterStatus
    const matchesEvent = filterEvent === "all" || attendee.event === filterEvent
    return matchesSearch && matchesStatus && matchesEvent
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendees</h2>
          <p className="text-muted-foreground">Loading attendees data...</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

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
            <div className="text-2xl font-bold">{stats.totalAttendees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmedAttendees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready to attend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingAttendees}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
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
            <Select value={filterEvent} onValueChange={setFilterEvent}>
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredAttendees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees yet</h3>
              <p className="text-gray-600 mb-4">Attendees will appear here when people register for your events</p>
              <Link href="/create-event">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Create Your First Event
                </Button>
              </Link>
            </div>
          ) : (
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
                  <p className="text-sm text-gray-500">{attendee.event}</p>
                  <p className="font-medium">₦{attendee.amount.toLocaleString()}</p>
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
