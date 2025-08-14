"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Share2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"
import { useEffect } from "react"

interface EventSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    id: string
    title: string
    slug: string
    start_date: string
    start_time: string
  }
  onContinue: () => void
}

export function EventSuccessModal({ isOpen, onClose, event, onContinue }: EventSuccessModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const { toast } = useToast()

  const eventUrl = `${window.location.origin}/events/${event.slug}`

  useEffect(() => {
    if (isOpen && event) {
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
  }, [isOpen, event, eventUrl])

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            Event Created Successfully!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
            <Badge variant="secondary" className="mb-4">
              {new Date(event.start_date).toLocaleDateString()} at {event.start_time}
            </Badge>
            <p className="text-sm text-gray-600">Your event is now live and ready to accept registrations!</p>
          </div>

          {/* Event Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Event Registration Link</label>
            <div className="flex items-center space-x-2">
              <Input value={eventUrl} readOnly className="flex-1" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(eventUrl)} className="shrink-0">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open(eventUrl, "_blank")} className="shrink-0">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <label className="text-sm font-medium text-gray-700 block mb-3">QR Code for Easy Sharing</label>
            {qrCodeUrl && (
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="Event QR Code" className="w-32 h-32" />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">Share this QR code for quick event registration</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Button onClick={shareEvent} className="bg-purple-600 hover:bg-purple-700">
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </Button>
            <Button variant="outline" onClick={onContinue}>
              Continue to Event Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
