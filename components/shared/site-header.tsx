"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bell } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth/auth-provider"
import { useState } from "react"

interface SiteHeaderProps {
  showCreateEvent?: boolean
}

export function SiteHeader({ showCreateEvent = true }: SiteHeaderProps) {
  const { user, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleCreateEvent = () => {
    if (!user) {
      setShowLoginModal(true)
    }
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="cursor-pointer">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20Project%20-%20New%20Group-woZ5DijlWxWDR7kaScHaUxptjShI69.png"
              alt="Ticket Campus"
              width={160}
              height={60}
              className="h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/events" className="text-gray-600 hover:text-gray-900 font-medium">
            Events
          </Link>
          <Link href="/#pricing" className="text-gray-600 hover:text-gray-900 font-medium">
            Pricing
          </Link>
          <Link href="/#features" className="text-gray-600 hover:text-gray-900 font-medium">
            Features
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {showCreateEvent && (
                <Link href="/create-event">
                  <Button className="bg-[#3A00C1] hover:bg-[#2A0091] rounded-md font-medium">Create Event</Button>
                </Link>
              )}
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
                  <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
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

      {/* Login Modal for unauthenticated users */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
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
    </header>
  )
}
