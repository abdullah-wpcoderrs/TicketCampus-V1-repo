"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Check, Star, Upload, Palette, Send, Bell } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function HomePage() {
  const { user, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleCreateEvent = () => {
    if (!user) {
      setShowLoginModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="cursor-pointer">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20Project%20-%20New%20Group-woZ5DijlWxWDR7kaScHaUxptjShI69.png"
                alt="Ticket Campus"
                width={140}
                height={50}
                className="h-10 w-auto cursor-pointer"
              />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/events" className="text-gray-600 hover:text-gray-900 font-medium">
              Events
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">
              Pricing
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-gray-900 font-medium">
              Features
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm">
                  <Bell className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatarUrl || ""} alt={user?.firstName || ""} />
                        <AvatarFallback>
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#3A00C1] hover:bg-[#2A0091] rounded-md font-medium">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Create, Share, and Promote
          <br />
          Events in Minutes
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-['var(--font-body)']">
          From setup to promotion, we make it effortless for organizers and magical for attendees.
        </p>
        <div className="flex items-center justify-center space-x-6">
          {user ? (
            <Link href="/create-event">
              <Button size="lg" className="bg-[#3A00C1] hover:bg-[#2A0091] rounded-md px-8 py-4 text-lg font-medium">
                Create Your First Event
              </Button>
            </Link>
          ) : (
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-[#3A00C1] hover:bg-[#2A0091] rounded-md px-8 py-4 text-lg font-medium"
                  onClick={handleCreateEvent}
                >
                  Create Your First Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Sign in required</DialogTitle>
                  <DialogDescription>
                    You need to sign in to create events. Join thousands of organizers already using Ticket Campus.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-3 mt-4">
                  <Link href="/signup" className="w-full">
                    <Button className="w-full bg-[#3A00C1] hover:bg-[#2A0091]">Create Account</Button>
                  </Link>
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full bg-transparent">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Link href="/events">
            <Button
              size="lg"
              variant="outline"
              className="border-[#3A00C1] text-[#3A00C1] hover:bg-[#3A00C1] hover:text-white rounded-md px-8 py-4 text-lg font-medium bg-transparent"
            >
              Browse Events
            </Button>
          </Link>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See It In Action</h2>
            <p className="text-xl text-gray-600 font-['var(--font-body)']">
              Try our invite creator - upload a photo and see the magic
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="rounded-md shadow-sm border-0 bg-white">
              <CardContent className="p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Create Personalized Invites</h3>
                    <p className="text-gray-600 font-['var(--font-body)']">
                      Upload a headshot, choose from beautiful templates, and instantly generate personalized invites
                      for every attendee.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Upload className="w-5 h-5 text-[#3A00C1]" />
                        <span className="font-['var(--font-body)']">Upload your photo</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Palette className="w-5 h-5 text-[#3A00C1]" />
                        <span className="font-['var(--font-body)']">Choose a template</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Send className="w-5 h-5 text-[#3A00C1]" />
                        <span className="font-['var(--font-body)']">Send personalized invites</span>
                      </div>
                    </div>
                    <Button className="bg-[#3A00C1] hover:bg-[#2A0091] rounded-md">Try Demo</Button>
                  </div>
                  <div className="bg-gradient-to-br from-[#3A00C1]/10 to-[#3A00C1]/5 rounded-md p-8 text-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500 font-['var(--font-body)']">Interactive demo placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 font-['var(--font-body)']">Three simple steps to amazing events</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3A00C1] rounded-md flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Create</h3>
              <p className="text-gray-600 font-['var(--font-body)']">
                Simple forms with custom fields. Build your event page in minutes with our intuitive wizard.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#3A00C1] rounded-md flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Share</h3>
              <p className="text-gray-600 font-['var(--font-body)']">
                Instant QR codes, shareable links, and personalized invites. Reach your audience everywhere.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#3A00C1] rounded-md flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Engage</h3>
              <p className="text-gray-600 font-['var(--font-body)']">
                Automated reminders via email and WhatsApp. Keep attendees informed and excited.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 font-['var(--font-body)']">
              Everything you need to create memorable events
            </p>
          </div>

          <div className="space-y-20">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Personalized Invites at Scale</h3>
                <p className="text-lg text-gray-600 mb-6 font-['var(--font-body)']">
                  Create unique, personalized invitations for every attendee. Upload photos, customize templates, and
                  send thousands of personalized invites with just a few clicks.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-[#3A00C1]" />
                    <span className="font-['var(--font-body)']">Custom photo integration</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-[#3A00C1]" />
                    <span className="font-['var(--font-body)']">Beautiful templates</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-[#3A00C1]" />
                    <span className="font-['var(--font-body)']">Bulk personalization</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#3A00C1]/10 to-[#3A00C1]/5 rounded-md p-8 h-80 flex items-center justify-center">
                <p className="text-gray-500 font-['var(--font-body)']">Personalized Invites Preview</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-[#3A00C1]/10 to-[#3A00C1]/5 rounded-md p-8 h-80 flex items-center justify-center md:order-1">
                <p className="text-gray-500 font-['var(--font-body)']">Payment & Wallet Preview</p>
              </div>
              <div className="md:order-2">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Integrated Payments & Wallet</h3>
                <p className="text-lg text-gray-600 mb-6 font-['var(--font-body)']">
                  Seamless payment processing with built-in wallet system. Handle ticket sales, track earnings, and
                  manage payouts all in one place.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-[#3A00C1]" />
                    <span className="font-['var(--font-body)']">Secure payment processing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-[#3A00C1]" />
                    <span className="font-['var(--font-body)']">Built-in wallet system</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-[#3A00C1]" />
                    <span className="font-['var(--font-body)']">Instant payouts</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">No-Signup Registration</h3>
                <p className="text-lg text-gray-600 mb-6 font-['var(--font-body)']">
                  Remove barriers for attendees. They can register for events without creating accounts, making the
                  process quick and friction-free.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-[#3A00C1]" />
                    <span className="font-['var(--font-body)']">One-click registration</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-[#3A00C1]" />
                    <span className="font-['var(--font-body)']">Email-only signup</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-[#3A00C1]" />
                    <span className="font-['var(--font-body)']">Instant confirmation</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#3A00C1]/10 to-[#3A00C1]/5 rounded-md p-8 h-80 flex items-center justify-center">
                <p className="text-gray-500 font-['var(--font-body)']">Registration Flow Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 font-['var(--font-body)']">Choose the plan that works for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="rounded-md shadow-sm border-2 border-gray-200">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">₦0</div>
                <p className="text-gray-600 font-['var(--font-body)']">per month</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">1 event per month</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Up to 50 attendees</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Basic features</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Email support</span>
                </div>
                <Button className="w-full mt-8 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-md">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="rounded-md shadow-sm border-2 border-[#3A00C1] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#3A00C1] text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">₦15,000</div>
                <p className="text-gray-600 font-['var(--font-body)']">per month</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Unlimited events</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Unlimited attendees</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Personalized invites</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Promotion tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Priority support</span>
                </div>
                <Button className="w-full mt-8 bg-[#3A00C1] hover:bg-[#2A0091] rounded-md">Start Free Trial</Button>
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card className="rounded-md shadow-sm border-2 border-gray-200">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Business</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">₦35,000</div>
                <p className="text-gray-600 font-['var(--font-body)']">per month</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Everything in Pro</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Advanced analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">White-label options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-[#3A00C1]" />
                  <span className="font-['var(--font-body)']">Dedicated support</span>
                </div>
                <Button className="w-full mt-8 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-md">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Organizers Say</h2>
            <p className="text-xl text-gray-600 font-['var(--font-body)']">
              Join thousands of successful event organizers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="rounded-md shadow-sm border-0 bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 font-['var(--font-body)']">
                  "Ticket made organizing our tech conference incredibly easy. The personalized invites were a huge
                  hit!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-gray-500 font-['var(--font-body)']">Tech Conference Organizer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md shadow-sm border-0 bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 font-['var(--font-body)']">
                  "The payment integration is seamless. We processed over ₦2M in ticket sales without any issues."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold">Michael Chen</p>
                    <p className="text-sm text-gray-500 font-['var(--font-body)']">Music Festival Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md shadow-sm border-0 bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 font-['var(--font-body)']">
                  "Best event platform I've used. The analytics help us understand our audience better than ever."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold">Aisha Okafor</p>
                    <p className="text-sm text-gray-500 font-['var(--font-body)']">Workshop Facilitator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#3A00C1] py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Your Next Event is Just 3 Minutes Away</h2>
          <p className="text-xl text-purple-100 mb-8 font-['var(--font-body)']">
            Join thousands of organizers who trust Ticket for their events
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-[#3A00C1] hover:bg-gray-100 rounded-md px-8 py-4 text-lg font-medium"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20Project%20-%20New%20Group-woZ5DijlWxWDR7kaScHaUxptjShI69.png"
                  alt="Ticket Campus"
                  width={140}
                  height={50}
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 font-['var(--font-body)']">
                The easiest way to create, share, and promote events.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white font-['var(--font-body)']">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white font-['var(--font-body)']">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-white font-['var(--font-body)']">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white font-['var(--font-body)']">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white font-['var(--font-body)']">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white font-['var(--font-body)']">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white font-['var(--font-body)']">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white font-['var(--font-body)']">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white font-['var(--font-body)']">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p className="font-['var(--font-body)']">&copy; 2024 Ticket Campus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
