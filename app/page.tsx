import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Zap, Shield, MapPin, Clock } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const featuredEvents = [
    {
      id: 1,
      title: "Tech Conference 2024",
      description: "Join industry leaders for cutting-edge tech discussions",
      date: "March 15, 2024",
      time: "9:00 AM",
      location: "Lagos, Nigeria",
      price: "₦15,000",
      image: "/tech-conference.png",
      category: "Technology",
    },
    {
      id: 2,
      title: "Digital Marketing Workshop",
      description: "Learn the latest digital marketing strategies",
      date: "March 20, 2024",
      time: "2:00 PM",
      location: "Abuja, Nigeria",
      price: "₦8,500",
      image: "/marketing-workshop.png",
      category: "Business",
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      description: "Pitch your startup idea to top investors",
      date: "March 25, 2024",
      time: "10:00 AM",
      location: "Online Event",
      price: "Free",
      image: "/startup-pitch.png",
      category: "Startup",
    },
    {
      id: 4,
      title: "Art Exhibition Opening",
      description: "Contemporary African art showcase",
      date: "March 28, 2024",
      time: "6:00 PM",
      location: "Victoria Island, Lagos",
      price: "₦5,000",
      image: "/art-exhibition.png",
      category: "Arts",
    },
    {
      id: 5,
      title: "Fitness Bootcamp",
      description: "High-intensity workout session",
      date: "March 30, 2024",
      time: "7:00 AM",
      location: "Lekki, Lagos",
      price: "₦3,000",
      image: "/fitness-bootcamp.png",
      category: "Health",
    },
    {
      id: 6,
      title: "Music Festival 2024",
      description: "Three days of amazing live music",
      date: "April 5, 2024",
      time: "4:00 PM",
      location: "Abuja Stadium",
      price: "₦25,000",
      image: "/music-festival-stage.png",
      category: "Music",
    },
    {
      id: 7,
      title: "Cooking Masterclass",
      description: "Learn to cook authentic Nigerian dishes",
      date: "April 8, 2024",
      time: "11:00 AM",
      location: "Ikeja, Lagos",
      price: "₦12,000",
      image: "/cooking-class-kitchen.png",
      category: "Food",
    },
    {
      id: 8,
      title: "Photography Workshop",
      description: "Master the art of portrait photography",
      date: "April 12, 2024",
      time: "1:00 PM",
      location: "Port Harcourt",
      price: "₦7,500",
      image: "/photography-workshop-camera.png",
      category: "Arts",
    },
    {
      id: 9,
      title: "Blockchain Summit",
      description: "Explore the future of blockchain technology",
      date: "April 15, 2024",
      time: "9:30 AM",
      location: "Online Event",
      price: "₦20,000",
      image: "/placeholder-n5lhz.png",
      category: "Technology",
    },
    {
      id: 10,
      title: "Fashion Show 2024",
      description: "Showcase of emerging African designers",
      date: "April 18, 2024",
      time: "7:00 PM",
      location: "Eko Hotel, Lagos",
      price: "₦18,000",
      image: "/fashion-show-runway.png",
      category: "Fashion",
    },
    {
      id: 11,
      title: "Real Estate Investment Seminar",
      description: "Learn smart real estate investment strategies",
      date: "April 22, 2024",
      time: "10:00 AM",
      location: "Kano, Nigeria",
      price: "₦15,000",
      image: "/placeholder-ssf7s.png",
      category: "Business",
    },
    {
      id: 12,
      title: "Youth Leadership Conference",
      description: "Empowering the next generation of leaders",
      date: "April 25, 2024",
      time: "8:00 AM",
      location: "University of Lagos",
      price: "₦5,000",
      image: "/youth-leadership-conference.png",
      category: "Education",
    },
    {
      id: 13,
      title: "Wine Tasting Evening",
      description: "Explore premium wines from around the world",
      date: "April 28, 2024",
      time: "6:30 PM",
      location: "Ikoyi, Lagos",
      price: "₦22,000",
      image: "/elegant-wine-tasting.png",
      category: "Food",
    },
    {
      id: 14,
      title: "Mental Health Awareness Workshop",
      description: "Understanding and supporting mental wellness",
      date: "May 2, 2024",
      time: "2:00 PM",
      location: "Ibadan, Nigeria",
      price: "Free",
      image: "/mental-health-workshop-support.png",
      category: "Health",
    },
    {
      id: 15,
      title: "E-commerce Masterclass",
      description: "Build and scale your online business",
      date: "May 5, 2024",
      time: "11:00 AM",
      location: "Online Event",
      price: "₦10,000",
      image: "/placeholder-9jgoq.png",
      category: "Business",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ThePlace</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/events" className="text-gray-600 hover:text-gray-900 font-medium">
              Events
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Create Amazing Events with <span className="text-purple-600">ThePlace</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The all-in-one platform for event management. Create, promote, and manage your events with powerful tools and
          seamless integrations.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href="/signup">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Creating Events
            </Button>
          </Link>
          <Link href="/events">
            <Button size="lg" variant="outline">
              Browse Events
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
          <p className="text-lg text-gray-600">Discover amazing events happening near you</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredEvents.slice(0, 15).map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden border border-gray-200 rounded-[4px] shadow-none hover:shadow-sm transition-shadow"
            >
              <div className="relative h-48">
                <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 text-xs font-medium px-2 py-1 rounded-[4px]">{event.category}</span>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-semibold text-purple-600">{event.price}</span>
                  <Link href={`/events/${event.id}`}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/events">
            <Button size="lg" variant="outline">
              View All Events
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to manage events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-gray-200 rounded-[4px] shadow-none">
            <CardHeader>
              <Calendar className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Event Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create beautiful event pages with our intuitive wizard. Add images, descriptions, and custom fields.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-[4px] shadow-none">
            <CardHeader>
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Attendee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage registrations, send invites, and track attendance with QR codes and check-in tools.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-[4px] shadow-none">
            <CardHeader>
              <Zap className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Payment Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Secure payment processing with Paystack integration. Handle tickets, donations, and refunds.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-[4px] shadow-none">
            <CardHeader>
              <Shield className="w-8 h-8 text-orange-600 mb-2" />
              <CardTitle>Analytics & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track event performance with detailed analytics. Monitor sales, attendance, and engagement.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 ThePlace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
