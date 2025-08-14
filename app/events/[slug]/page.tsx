"use client"

import { useState } from "react"
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

// Mock event data - in real app, fetch based on slug
const mockEvent = {
  id: "1",
  slug: "tech-conference-2024",
  title: "Tech Conference 2024",
  description:
    "Join us for the most anticipated technology conference of the year! This comprehensive event brings together industry leaders, innovative startups, and tech enthusiasts to explore the latest trends in artificial intelligence, blockchain technology, and web development.\n\nFeaturing keynote speakers from major tech companies, interactive workshops, networking sessions, and product demonstrations. Whether you're a developer, entrepreneur, or tech enthusiast, this conference offers valuable insights and networking opportunities.\n\nTopics include: AI & Machine Learning, Blockchain & Cryptocurrency, Web3 & Decentralized Applications, Cloud Computing, Cybersecurity, and much more.",
  startDate: "2024-03-15",
  startTime: "09:00",
  endDate: "2024-03-15",
  endTime: "17:00",
  timezone: "Africa/Lagos",
  location: "Lagos Continental Hotel",
  venueAddress: "52A Kofo Abayomi Street, Victoria Island",
  city: "Lagos",
  state: "Lagos",
  country: "Nigeria",
  isOnline: false,
  meetingLink: "",
  category: "Technology",
  eventType: "paid",
  bannerImage: "/tech-conference-banner.png",
  galleryImages: ["/tech-conference-venue.png", "/placeholder-c0fsm.png", "/placeholder-njmc2.png"],
  attendeeCount: 150,
  maxCapacity: 200,
  basePrice: 25000,
  organizer: {
    name: "Tech Hub Lagos",
    email: "info@techublagos.com",
    phone: "+234 800 000 0000",
    website: "https://techublagos.com",
    avatar: "/tech-hub-logo.png",
    bio: "Leading technology community in Lagos, organizing events and workshops to advance the tech ecosystem.",
  },
  ticketTypes: [
    {
      id: "1",
      name: "Early Bird",
      description: "Limited time offer for early registrations",
      price: 20000,
      quantity: 50,
      sold: 45,
      saleEndDate: "2024-03-10",
    },
    {
      id: "2",
      name: "Regular",
      description: "Standard conference ticket with full access",
      price: 25000,
      quantity: 100,
      sold: 75,
      saleEndDate: "2024-03-14",
    },
    {
      id: "3",
      name: "VIP",
      description: "Premium ticket with exclusive networking session and lunch",
      price: 40000,
      quantity: 50,
      sold: 30,
      saleEndDate: "2024-03-14",
    },
  ],
  agenda: [
    { time: "09:00 - 09:30", title: "Registration & Welcome Coffee", speaker: "" },
    { time: "09:30 - 10:30", title: "Keynote: The Future of AI", speaker: "Dr. Sarah Johnson" },
    { time: "10:30 - 10:45", title: "Coffee Break", speaker: "" },
    { time: "10:45 - 11:45", title: "Workshop: Building with React", speaker: "Mike Chen" },
    { time: "11:45 - 12:45", title: "Panel: Blockchain in Africa", speaker: "Various Speakers" },
    { time: "12:45 - 13:45", title: "Lunch & Networking", speaker: "" },
    { time: "13:45 - 14:45", title: "Startup Pitch Session", speaker: "Selected Startups" },
    { time: "14:45 - 15:45", title: "Workshop: Cloud Architecture", speaker: "Alex Thompson" },
    { time: "15:45 - 16:00", title: "Coffee Break", speaker: "" },
    { time: "16:00 - 17:00", title: "Closing Keynote & Networking", speaker: "Industry Leaders" },
  ],
  isPublished: true,
  requiresApproval: false,
  allowGuestRegistration: true,
}

export default function EventDetailPage() {
  const params = useParams()
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null)

  // In real app, fetch event data based on params.slug
  const event = mockEvent

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
              src={event.bannerImage || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant={event.eventType === "free" ? "secondary" : "default"} className="bg-white text-black">
                    {event.eventType === "free" ? "Free Event" : "Paid Event"}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {event.category}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <p className="text-lg opacity-90">Organized by {event.organizer.name}</p>
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
                    <p className="font-medium">{formatDate(event.startDate, event.startTime)}</p>
                    <p className="text-sm text-gray-500">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">{event.isOnline ? "Online Event" : `${event.location}`}</p>
                    <p className="text-sm text-gray-500">
                      {event.isOnline ? "Join from anywhere" : `${event.city}, ${event.state}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">{event.attendeeCount} attending</p>
                    <p className="text-sm text-gray-500">{event.maxCapacity - event.attendeeCount} spots left</p>
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
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
                            {formatDate(event.startDate, event.startTime)}
                            <br />
                            {formatTime(event.startTime)} - {formatTime(event.endTime)} ({event.timezone})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Location</p>
                          {event.isOnline ? (
                            <p className="text-sm text-gray-600">Online Event</p>
                          ) : (
                            <div className="text-sm text-gray-600">
                              <p>{event.location}</p>
                              <p>{event.venueAddress}</p>
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

              <TabsContent value="agenda">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Agenda</CardTitle>
                    <CardDescription>Schedule of activities for the day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                          <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg flex-shrink-0">
                            <Clock className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{item.title}</h4>
                              <span className="text-sm text-gray-500 font-mono">{item.time}</span>
                            </div>
                            {item.speaker && <p className="text-sm text-gray-600">Speaker: {item.speaker}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Gallery</CardTitle>
                    <CardDescription>Photos from previous events and venue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {event.galleryImages.map((image, index) => (
                        <div key={index} className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
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
                {event.eventType === "free" ? (
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
                    {event.ticketTypes.map((ticket) => (
                      <div key={ticket.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{ticket.name}</h4>
                          <span className="font-bold">₦{ticket.price.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {ticket.quantity - ticket.sold} of {ticket.quantity} left
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleRegister(ticket.id)}
                            disabled={ticket.sold >= ticket.quantity}
                            className="bg-[#3A00C1] hover:bg-[#2A0091] rounded-md"
                          >
                            {ticket.sold >= ticket.quantity ? "Sold Out" : "Select"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center">
                  {event.requiresApproval && <p>• Registration requires approval</p>}
                  {!event.allowGuestRegistration && <p>• Account required to register</p>}
                </div>
              </CardContent>
            </Card>

            {/* Organizer Card */}
            <Card>
              <CardHeader>
                <CardTitle>Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={event.organizer.avatar || ""} alt={event.organizer.name} />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{event.organizer.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{event.organizer.bio}</p>
                    <div className="space-y-2">
                      {event.organizer.email && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${event.organizer.email}`} className="text-purple-600 hover:underline">
                            {event.organizer.email}
                          </a>
                        </div>
                      )}
                      {event.organizer.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a href={`tel:${event.organizer.phone}`} className="text-purple-600 hover:underline">
                            {event.organizer.phone}
                          </a>
                        </div>
                      )}
                      {event.organizer.website && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <a
                            href={event.organizer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline flex items-center"
                          >
                            Visit Website
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
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
