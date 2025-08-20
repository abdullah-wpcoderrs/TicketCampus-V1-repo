"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, DollarSign, Calendar, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"

interface AnalyticsStats {
  totalRevenue: number
  totalAttendees: number
  totalEvents: number
  avgConversionRate: string
  recentEvents: Array<{
    id: string
    title: string
    date: string
    status: string
    attendees: number
    revenue: number
    conversionRate: string
    views: number
  }>
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsStats>({
    totalRevenue: 0,
    totalAttendees: 0,
    totalEvents: 0,
    avgConversionRate: "0%",
    recentEvents: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        
        // Transform data for analytics view
        const transformedData = {
          totalRevenue: data.totalRevenue || 0,
          totalAttendees: data.totalAttendees || 0,
          totalEvents: data.totalEvents || 0,
          avgConversionRate: data.totalEvents > 0 ? "12.5%" : "0%", // Calculate from actual data later
          recentEvents: data.recentEvents.map((event: any) => ({
            ...event,
            revenue: event.revenue || 0,
            conversionRate: "15.0%", // Calculate from actual data later
            views: Math.floor(Math.random() * 1000) + 500 // Placeholder until we have view tracking
          }))
        }
        
        setAnalytics(transformedData)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Loading your analytics...</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

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
            <div className="text-2xl font-bold">₦{analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalRevenue === 0 ? "Start earning from events" : "From ticket sales"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAttendees}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalEvents === 0 ? "No events yet" : `Across ${analytics.totalEvents} events`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalEvents === 0 ? "Create your first event" : "Events created"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgConversionRate}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalEvents === 0 ? "No data yet" : "View to registration rate"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentEvents.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data yet</h3>
              <p className="text-gray-600 mb-4">Create events and get attendees to see performance metrics</p>
              <Link href="/create-event">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Create Your First Event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge variant={event.status === "completed" ? "secondary" : "default"}>{event.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{new Date(event.date).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-sm font-medium">{event.attendees}</div>
                      <div className="text-xs text-muted-foreground">Attendees</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">₦{event.revenue.toLocaleString()}</div>
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
                          <Link href={`/dashboard/events/${event.id}`}>View Event Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/attendees`}>View Attendees</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/events`}>Manage Events</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentEvents.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No events to analyze yet</p>
              ) : (
                analytics.recentEvents
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
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.totalRevenue === 0 ? (
                <p className="text-center text-gray-500 py-4">No revenue data yet</p>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span>Total Revenue</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                      <span className="text-sm font-medium">₦{analytics.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Events Created</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                      <span className="text-sm font-medium">{analytics.totalEvents}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
