"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/shared/site-header"

// Mock public events data
const mockPublicEvents = [
  {
    id: "1",
    slug: "tech-conference-2024",
    title: "Tech Conference 2024",
    description: "Annual technology conference featuring the latest innovations in AI, blockchain, and web development",
    startDate: "2024-03-15",
    startTime: "09:00",
    endDate: "2024-03-15",
    endTime: "17:00",
    location: "Lagos Continental Hotel",
    city: "Lagos",
    state: "Lagos",
    isOnline: false,
    category: "Technology",
    eventType: "paid",
    bannerImage: "/tech-conference.png",
    attendeeCount: 150,
    maxCapacity: 200,
    basePrice: 25000,
    organizer: "Tech Hub Lagos",
    isPublished: true,
  },
  {
    id: "2",
    slug: "marketing-workshop",
    title: "Digital Marketing Workshop",
    description: "Learn digital marketing strategies for small businesses and startups",
    startDate: "2024-03-20",
    startTime: "14:00",
    endDate: "2024-03-20",
    endTime: "18:00",
    location: "Online Event",
    city: "Online",
    state: "Online",
    isOnline: true,
    category: "Business & Professional",
    eventType: "paid",
    bannerImage: "/marketing-workshop.png",
    attendeeCount: 45,
    maxCapacity: 100,
    basePrice: 15000,
    organizer: "Marketing Pro Academy",
    isPublished: true,
  },
  {
    id: "3",
    slug: "startup-pitch-night",
    title: "Startup Pitch Night",
    description: "Entrepreneurs pitch their innovative ideas to investors and industry experts",
    startDate: "2024-03-25",
    startTime: "18:00",
    endDate: "2024-03-25",
    endTime: "21:00",
    location: "Innovation Hub",
    city: "Abuja",
    state: "FCT",
    isOnline: false,
    category: "Business & Professional",
    eventType: "free",
    bannerImage: "/startup-pitch.png",
    attendeeCount: 80,
    maxCapacity: 100,
    basePrice: 0,
    organizer: "Startup Community Abuja",
    isPublished: true,
  },
  {
    id: "4",
    slug: "art-exhibition-opening",
    title: "Contemporary Art Exhibition",
    description: "Opening night for contemporary art exhibition featuring local and international artists",
    startDate: "2024-04-05",
    startTime: "17:00",
    endDate: "2024-04-05",
    endTime: "22:00",
    location: "National Gallery",
    city: "Lagos",
    state: "Lagos",
    isOnline: false,
    category: "Arts & Culture",
    eventType: "free",
    bannerImage: "/art-exhibition.png",
    attendeeCount: 25,
    maxCapacity: 150,
    basePrice: 0,
    organizer: "National Gallery Lagos",
    isPublished: true,
  },
  {
    id: "5",
    slug: "fitness-bootcamp",
    title: "Weekend Fitness Bootcamp",
    description: "High-intensity fitness bootcamp for all fitness levels with professional trainers",
    startDate: "2024-03-30",
    startTime: "07:00",
    endDate: "2024-03-30",
    endTime: "09:00",
    location: "Tafawa Balewa Square",
    city: "Lagos",
    state: "Lagos",
    isOnline: false,
    category: "Sports & Fitness",
    eventType: "paid",
    bannerImage: "/fitness-bootcamp.png",
    attendeeCount: 30,
    maxCapacity: 50,
    basePrice: 5000,
    organizer: "FitLife Lagos",
    isPublished: true,
  },
]

const categories = [
  "All Categories",
  "Technology",
  "Business & Professional",
  "Arts & Culture",
  "Sports & Fitness",
  "Health & Wellness",
  "Music & Entertainment",
  "Education",
  "Food & Drink",
]

const locations = ["All Locations", "Lagos", "Abuja", "Port Harcourt", "Kano", "Online"]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [eventType, setEventType] = useState("all")

  const filteredEvents = mockPublicEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "All Categories" || event.category === selectedCategory

    const matchesLocation =
      selectedLocation === "All Locations" ||
      event.state === selectedLocation ||
      (selectedLocation === "Online" && event.isOnline)

    const matchesType = eventType === "all" || event.eventType === eventType

    return matchesSearch && matchesCategory && matchesLocation && matchesType && event.isPublished
  })

  const formatDate = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`)
    return eventDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Events</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find and join events that match your interests. From tech conferences to art exhibitions, there's something
            for everyone.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search events, organizers, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="w-full lg:w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow rounded-md">
                <div className="aspect-video relative">
                  <img
                    src={event.bannerImage || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={event.eventType === "free" ? "secondary" : "default"}>
                      {event.eventType === "free" ? "Free" : `₦${event.basePrice.toLocaleString()}`}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{event.description}</p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(event.startDate, event.startTime)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.isOnline ? "Online Event" : `${event.location}, ${event.city}`}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendeeCount}/{event.maxCapacity} attending
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-xs text-gray-500">Organized by</p>
                        <p className="text-sm font-medium">{event.organizer}</p>
                      </div>
                      <Link href={`/events/${event.slug}`}>
                        <Button size="sm" className="bg-[#3A00C1] hover:bg-[#2A0091] rounded-md">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or browse all events to discover something new.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All Categories")
                    setSelectedLocation("All Locations")
                    setEventType("all")
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
