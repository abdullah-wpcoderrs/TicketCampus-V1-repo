"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, DollarSign, Calendar, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function AnalyticsPage() {
  // Mock data - in real app, fetch user's events analytics
  const overallStats = {
    totalRevenue: "₦1,250,000",
    totalAttendees: 450,
    totalEvents: 8,
    avgConversionRate: "14.2%",
  }

  const events = [
    {
      id: "1",
      title: "Tech Conference 2024",
      date: "2024-03-15",
      status: "upcoming",
      attendees: 150,
      revenue: "₦450,000",
      conversionRate: "12.5%",
      views: 1200,
    },
    {
      id: "2",
      title: "Marketing Workshop",
      date: "2024-02-28",
      status: "completed",
      attendees: 85,
      revenue: "₦180,000",
      conversionRate: "18.3%",
      views: 650,
    },
    {
      id: "3",
      title: "Startup Pitch Night",
      date: "2024-04-10",
      status: "upcoming",
      attendees: 120,
      revenue: "₦320,000",
      conversionRate: "15.8%",
      views: 890,
    },
    {
      id: "4",
      title: "Art Exhibition Opening",
      date: "2024-01-20",
      status: "completed",
      attendees: 95,
      revenue: "₦300,000",
      conversionRate: "11.2%",
      views: 1100,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Track your events performance and insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">+25.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalAttendees}</div>
            <p className="text-xs text-muted-foreground">Across {overallStats.totalEvents} events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">2 upcoming, 6 completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgConversionRate}</div>
            <p className="text-xs text-muted-foreground">+3.2% from industry avg</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{event.title}</h3>
                    <Badge variant={event.status === "completed" ? "secondary" : "default"}>{event.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-sm font-medium">{event.attendees}</div>
                    <div className="text-xs text-muted-foreground">Attendees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{event.revenue}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{event.conversionRate}</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {event.views}
                    </div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/analytics/${event.id}`}>View Detailed Analytics</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/attendees/${event.id}`}>View Attendees</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/events`}>Edit Event</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .sort((a, b) => Number.parseFloat(b.conversionRate) - Number.parseFloat(a.conversionRate))
                .slice(0, 3)
                .map((event, index) => (
                  <div key={event.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">{event.attendees} attendees</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{event.conversionRate}</div>
                      <div className="text-xs text-muted-foreground">conversion</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Completed Events</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <span className="text-sm font-medium">₦812,500</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Upcoming Events</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                  <span className="text-sm font-medium">₦437,500</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
