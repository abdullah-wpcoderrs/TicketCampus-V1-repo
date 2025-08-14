import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Users, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"

interface EventAnalyticsPageProps {
  params: {
    eventId: string
  }
}

export default function EventAnalyticsPage({ params }: EventAnalyticsPageProps) {
  // Mock data - in real app, fetch based on eventId
  const event = {
    id: params.eventId,
    title: "Tech Conference 2024",
    date: "2024-03-15",
  }

  const analytics = {
    totalRevenue: "₦450,000",
    totalAttendees: 150,
    ticketsSold: 150,
    conversionRate: "12.5%",
    pageViews: 1200,
    uniqueVisitors: 890,
    socialShares: 45,
    emailOpens: "78%",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/analytics">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analytics
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Event Analytics</h2>
          <p className="text-muted-foreground">{event.title} - Detailed Performance Metrics</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last event</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAttendees}</div>
            <p className="text-xs text-muted-foreground">+15% from target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}</div>
            <p className="text-xs text-muted-foreground">+2.1% from average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pageViews}</div>
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
              <div className="flex justify-between items-center">
                <span>VIP Tickets</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                  <span className="text-sm font-medium">45 sold</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Regular Tickets</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                  <span className="text-sm font-medium">90 sold</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Student Tickets</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                  <span className="text-sm font-medium">15 sold</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marketing Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Email Open Rate</span>
                <span className="font-medium">{analytics.emailOpens}</span>
              </div>
              <div className="flex justify-between">
                <span>Social Media Shares</span>
                <span className="font-medium">{analytics.socialShares}</span>
              </div>
              <div className="flex justify-between">
                <span>Unique Visitors</span>
                <span className="font-medium">{analytics.uniqueVisitors}</span>
              </div>
              <div className="flex justify-between">
                <span>Referral Traffic</span>
                <span className="font-medium">23%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Attendees</CardTitle>
            <Link href={`/admin/attendees/${params.eventId}`}>
              <Button variant="outline" size="sm">
                View All Attendees
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "John Smith", email: "john@example.com", ticketType: "VIP", date: "2024-02-15" },
              { name: "Sarah Johnson", email: "sarah@example.com", ticketType: "Regular", date: "2024-02-18" },
              { name: "Mike Davis", email: "mike@example.com", ticketType: "Student", date: "2024-02-20" },
            ].map((attendee, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{attendee.name}</div>
                  <div className="text-sm text-muted-foreground">{attendee.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{attendee.ticketType}</div>
                  <div className="text-xs text-muted-foreground">{attendee.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
