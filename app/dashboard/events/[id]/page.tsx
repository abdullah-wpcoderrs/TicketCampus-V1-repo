"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Copy,
  ExternalLink,
  QrCode,
  Edit,
  Share2,
  BarChart3,
  UserCheck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"
import Link from "next/link"

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [event, setEvent] = useState<any>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [loading, setLoading] = useState(true)

  const eventUrl = event ? `${window.location.origin}/events/${event.slug}` : ""

  useEffect(() => {
    fetchEventDetails()
  }, [params.id])

  useEffect(() => {
    if (event && eventUrl) {
      QRCode.toDataURL(eventUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#3A00C1",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error("QR Code generation error:", err))
    }
  }, [event, eventUrl])

  const fetchEventDetails = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockEvent = {
        id: params.id,
        title: "Tech Conference 2024",
        description:
          "Annual technology conference featuring the latest innovations in AI, blockchain, and web development.",
        slug: "tech-conference-2024",
        category: "Technology",
        event_type: "paid",
        start_date: "2024-03-15",
        end_date: "2024-03-15",
        start_time: "09:00",
        end_time: "17:00",
        timezone: "Africa/Lagos",
        is_online: false,
        venue_name: "Lagos Continental Hotel",
        venue_address: "52A Kofo Abayomi Street, Victoria Island",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        max_capacity: 200,
        is_published: true,
        allow_guest_registration: true,
        requires_approval: false,
        created_at: "2024-02-01T10:00:00Z",
        attendees_count: 150,
        revenue: 750000,
        tickets_sold: 150,
      }

      setEvent(mockEvent)
    } catch (error) {
      console.error("Error fetching event:", error)
      toast({
        title: "Error loading event",
        description: "Failed to load event details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard!",
        description: "The event link has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join me at ${event.title}!`,
          url: eventUrl,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      copyToClipboard(eventUrl)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/dashboard/events")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/events")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={shareEvent}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Event
          </Button>
        </div>
      </div>

      {/* Event Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                <Badge variant={event.is_published ? "default" : "secondary"}>
                  {event.is_published ? "Published" : "Draft"}
                </Badge>
                <Badge variant="outline">{event.event_type}</Badge>
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <div>
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-sm">{new Date(event.start_date).toLocaleDateString()}</p>
                <p className="text-sm">
                  {event.start_time} - {event.end_time}
                </p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm">{event.venue_name}</p>
                <p className="text-sm">
                  {event.city}, {event.state}
                </p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <div>
                <p className="text-sm font-medium">Attendees</p>
                <p className="text-sm">
                  {event.attendees_count}/{event.max_capacity}
                </p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              <div>
                <p className="text-sm font-medium">Revenue</p>
                <p className="text-sm">₦{event.revenue?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href={`/dashboard/analytics/${event.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">View Analytics</h3>
                  <p className="text-sm text-gray-600">Detailed performance metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/dashboard/attendees/${event.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Attendees</h3>
                  <p className="text-sm text-gray-600">{event.attendees_count} registered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => window.open(eventUrl, "_blank")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ExternalLink className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">View Public Page</h3>
                <p className="text-sm text-gray-600">See how attendees see your event</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sharing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sharing">Sharing & Promotion</TabsTrigger>
          <TabsTrigger value="settings">Event Settings</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="sharing" className="space-y-6">
          {/* Event Link */}
          <Card>
            <CardHeader>
              <CardTitle>Event Registration Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value={eventUrl} readOnly className="flex-1" />
                <Button variant="outline" onClick={() => copyToClipboard(eventUrl)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => window.open(eventUrl, "_blank")}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Share this link with potential attendees to allow them to register for your event.
              </p>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  {qrCodeUrl && (
                    <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                      <img src={qrCodeUrl || "/placeholder.svg"} alt="Event QR Code" className="w-32 h-32" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Share QR Code</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Print this QR code on flyers, posters, or business cards for easy event registration.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.download = `${event.slug}-qr-code.png`
                      link.href = qrCodeUrl
                      link.click()
                    }}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Event Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <p className="text-sm text-gray-600">{event.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Capacity</label>
                    <p className="text-sm text-gray-600">{event.max_capacity} attendees</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Guest Registration</label>
                    <p className="text-sm text-gray-600">
                      {event.allow_guest_registration ? "Allowed" : "Account Required"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Approval Required</label>
                    <p className="text-sm text-gray-600">{event.requires_approval ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{event.tickets_sold || 0}</p>
                    <p className="text-sm text-gray-600">Tickets Sold</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{event.max_capacity - (event.tickets_sold || 0)}</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">₦{event.revenue?.toLocaleString() || 0}</p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
