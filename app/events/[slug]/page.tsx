"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Heart,
  ExternalLink,
  User,
  Mail,
  Phone,
  Globe,
  Ticket,
} from "lucide-react"
import Link from "next/link"
import { EventRegistrationModal } from "@/components/events/event-registration-modal"
import { SiteHeader } from "@/components/shared/site-header"


export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null)

  useEffect(() => {
    fetchEventBySlug()
  }, [params.slug])

  const fetchEventBySlug = async () => {
    try {
      const response = await fetch(`/api/events/slug/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader showCreateEvent={false} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading event...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`)
    return eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleRegister = (ticketTypeId?: string) => {
    setSelectedTicketType(ticketTypeId || null)
    setIsRegistrationOpen(true)
  }

  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description.substring(0, 100) + "...",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SiteHeader showCreateEvent={false} />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="aspect-video md:aspect-[3/1] relative rounded-lg overflow-hidden mb-6">
            <img
              src={event.banner_image_url || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant={event.event_type === "free" ? "secondary" : "default"} className="bg-white text-black">
                    {event.event_type === "free" ? "Free Event" : "Paid Event"}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {event.category}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <p className="text-lg opacity-90">Event Details</p>
              </div>
            </div>
          </div>

          {/* Quick Info & Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">{formatDate(event.start_date, event.start_time)}</p>
                    <p className="text-sm text-gray-500">
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="font-medium">{event.is_online ? "Online Event" : `${event.venue_name}`}</p>
                    <p className="text-sm text-gray-500">
                      {event.is_online ? "Join from anywhere" : `${event.city}, ${event.state}`}
                    </p>
                    {event.is_online && event.meeting_link && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(event.meeting_link, '_blank')}
                        className="mt-2 text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Join Meeting
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">{event.max_capacity} capacity</p>
                    <p className="text-sm text-gray-500">Event capacity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className={`grid w-full ${event.is_online ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                {event.is_online && <TabsTrigger value="venue">Venue</TabsTrigger>}
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      {event.description.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Date & Time</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(event.start_date, event.start_time)}
                            <br />
                            {formatTime(event.start_time)} - {formatTime(event.end_time)} ({event.timezone || "UTC"})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Location</p>
                          {event.is_online ? (
                            <p className="text-sm text-gray-600">Online Event</p>
                          ) : (
                            <div className="text-sm text-gray-600">
                              <p>{event.venue_name}</p>
                              <p>{event.venue_address}</p>
                              <p>
                                {event.city}, {event.state}, {event.country}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                    <CardDescription>More information about this event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Event Settings</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Guest Registration:</span>
                            <span className="ml-2">{event.allow_guest_registration ? "Allowed" : "Account Required"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Approval Required:</span>
                            <span className="ml-2">{event.requires_approval ? "Yes" : "No"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Event Type:</span>
                            <span className="ml-2">{event.event_type === "free" ? "Free Event" : "Paid Event"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Status:</span>
                            <span className="ml-2">{event.is_published ? "Published" : "Draft"}</span>
                          </div>
                        </div>
                      </div>
                      {event.gallery_images && event.gallery_images.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Gallery</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {event.gallery_images.map((image, index) => (
                              <div key={index} className="aspect-video rounded-lg overflow-hidden">
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Gallery image ${index + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {event.is_online && (
                <TabsContent value="venue">
                  <Card>
                    <CardHeader>
                      <CardTitle>Online Event Details</CardTitle>
                      <CardDescription>Join information for this online event</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Event Type</p>
                            <p className="text-sm text-gray-600">Online Event - Join from anywhere</p>
                          </div>
                        </div>
                        
                        {event.meeting_link && (
                          <div className="flex items-center space-x-3">
                            <ExternalLink className="w-5 h-5 text-purple-600" />
                            <div className="flex-1">
                              <p className="font-medium">Meeting Link</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <p className="text-sm text-gray-600 break-all">{event.meeting_link}</p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(event.meeting_link, '_blank')}
                                  className="shrink-0"
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Join
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-900">Important Notes</p>
                              <ul className="text-sm text-blue-800 mt-1 space-y-1">
                                <li>• Meeting link will be sent to registered participants 1 hour before the event</li>
                                <li>• Please test your audio and video before joining</li>
                                <li>• Ensure you have a stable internet connection</li>
                                {event.meeting_link && <li>• You can bookmark this link for easy access</li>}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Register for Event</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={shareEvent}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.event_type === "free" ? (
                  <div>
                    <div className="text-center mb-4">
                      <p className="text-2xl font-bold text-green-600">Free Event</p>
                      <p className="text-sm text-gray-600">No payment required</p>
                    </div>
                    <Button
                      onClick={() => handleRegister()}
                      className="w-full bg-[#3A00C1] hover:bg-[#2A0091] rounded-md"
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      Register Now
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">General Admission</h4>
                        <span className="font-bold">Paid Event</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Standard event ticket</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {event.max_capacity} capacity
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleRegister()}
                          className="bg-[#3A00C1] hover:bg-[#2A0091] rounded-md"
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center">
                  {event.requires_approval && <p>• Registration requires approval</p>}
                  {!event.allow_guest_registration && <p>• Account required to register</p>}
                </div>
              </CardContent>
            </Card>

            {/* Event Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Category</h4>
                    <p className="text-sm text-gray-600">{event.category}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Event Type</h4>
                    <p className="text-sm text-gray-600">{event.event_type === "free" ? "Free Event" : "Paid Event"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Capacity</h4>
                    <p className="text-sm text-gray-600">{event.max_capacity} attendees</p>
                  </div>
                  {event.timezone && (
                    <div>
                      <h4 className="font-medium">Timezone</h4>
                      <p className="text-sm text-gray-600">{event.timezone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={event}
        selectedTicketType={selectedTicketType}
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
    </div>
  )
}