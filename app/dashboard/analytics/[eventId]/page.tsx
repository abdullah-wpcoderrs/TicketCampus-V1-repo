"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Users, DollarSign, Eye, Calendar } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function EventAnalyticsPage() {
  const params = useParams()
  const eventId = params.eventId as string

  // Mock data - in real app, fetch specific event analytics
  const eventData = {
    id: eventId,
    title: "Tech Conference 2024",
    subtitle: "Detailed Performance Metrics",
    date: "2024-03-15",
    status: "upcoming",
  }

  const metrics = {
    totalRevenue: "₦450,000",
    totalAttendees: 150,
    conversionRate: "12.5%",
    pageViews: 1200,
  }

  const ticketSales = [
    { type: "VIP Tickets", sold: 45, total: 50, revenue: "₦225,000" },
    { type: "Regular Tickets", sold: 90, total: 100, revenue: "₦180,000" },
    { type: "Student Tickets", sold: 15, total: 30, revenue: "₦45,000" },
  ]

  const marketingMetrics = [
    { metric: "Email Open Rate", value: "78%" },
    { metric: "Social Media Shares", value: "45" },
    { metric: "Unique Visitors", value: "890" },
    { metric: "Referral Traffic", value: "23%" },
  ]

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
        <h2 className="text-3xl font-bold tracking-tight">Event Analytics</h2>
        <p className="text-muted-foreground">
          {eventData.title} - {eventData.subtitle}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last event</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalAttendees}</div>
            <p className="text-xs text-muted-foreground">+15% from target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}</div>
            <p className="text-xs text-muted-foreground">+2.1% from average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pageViews}</div>
            <p className="text-xs text-muted-foreground">+5.2% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Sales Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticketSales.map((ticket, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{ticket.type}</span>
                    <span className="text-sm text-muted-foreground">{ticket.sold} sold</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${index === 0 ? "bg-blue-600" : index === 1 ? "bg-green-600" : "bg-orange-600"}`}
                      style={{ width: `${(ticket.sold / ticket.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {ticket.sold}/{ticket.total} tickets
                    </span>
                    <span className="font-medium text-foreground">{ticket.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marketing Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketingMetrics.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{item.metric}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <Link href={`/dashboard/attendees/${eventId}`}>
            <Users className="h-4 w-4 mr-2" />
            View Attendees
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
