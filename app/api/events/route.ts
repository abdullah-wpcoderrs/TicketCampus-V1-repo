import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting event creation request")

    console.log("[v0] All cookies:", request.cookies.getAll().map(c => ({name: c.name, value: c.value ? '[present]' : '[empty]'})))

    const supabase = await createClient()
    console.log("[v0] Supabase client created")

    // Check if we have any cookies
    const cookieHeader = request.headers.get("cookie")
    console.log("[v0] Cookie header:", cookieHeader ? "Present" : "Missing")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Auth check - User:", user?.id, "Error:", authError?.message)

    if (authError || !user) {
      console.log("[v0] Authentication failed:", authError?.message || "Auth session missing!")
      return NextResponse.json(
        {
          message: "Unauthorized",
          debug: {
            authError: authError?.message,
            hasUser: !!user,
            hasCookies: !!cookieHeader,
          },
        },
        { status: 401 },
      )
    }

    const eventData = await request.json()
    console.log("[v0] Received event data for user:", user.id)

    // Handle file uploads (convert File objects to placeholder URLs)
    let bannerImageUrl = null
    let galleryImageUrls = []

    if (eventData.bannerImage && typeof eventData.bannerImage === "object") {
      // For now, we'll use a placeholder. In production, you'd upload to storage
      bannerImageUrl = `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(eventData.title || "Event Banner")}`
    }

    if (eventData.galleryImages && Array.isArray(eventData.galleryImages)) {
      galleryImageUrls = eventData.galleryImages.map(
        (_, index) => `/placeholder.svg?height=300&width=400&text=Gallery ${index + 1}`,
      )
    }

    const insertData = {
      user_id: user.id,
      title: eventData.title || "",
      description: eventData.description || "",
      category: eventData.category || "other",
      slug:
        eventData.slug ||
        eventData.title
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") ||
        "",
      start_date: eventData.startDate ? new Date(eventData.startDate).toISOString() : null,
      end_date: eventData.endDate ? new Date(eventData.endDate).toISOString() : null,
      start_time: eventData.startTime || null,
      end_time: eventData.endTime || null,
      timezone: eventData.timezone || "UTC",
      is_online: eventData.isOnline || false,
      venue_name: eventData.venueName || null,
      venue_address: eventData.venueAddress || null,
      city: eventData.city || null,
      state: eventData.state || null,
      country: eventData.country || null,
      meeting_link: eventData.meetingLink || null,
      banner_image_url: bannerImageUrl,
      gallery_images: galleryImageUrls,
      max_capacity: eventData.maxCapacity || 0,
      is_published: true,
      allow_guest_registration: eventData.allowGuestRegistration !== false,
      requires_approval: eventData.requiresApproval || false,
      custom_fields: eventData.customFields || [],
      event_type: eventData.eventType || "free",
      meta_description: eventData.metaDescription || "",
      enable_promotions: eventData.enablePromotions || false,
      promotion_channels: eventData.promotionChannels || [],
      enable_getdp: eventData.enableGetDP || false,
      getdp_template: eventData.getdpTemplate || null,
      whatsapp_messages: eventData.whatsappMessages || null,
      email_messages: eventData.emailMessages || null,
      auto_send_confirmation: eventData.autoSendConfirmation !== false,
      auto_send_reminders: eventData.autoSendReminders || false,
      reminder_timing: eventData.reminderTiming || "24h",
    }

    console.log("[v0] Attempting to insert event for user:", user.id)

    const { data: newEvent, error } = await supabase.from("events").insert(insertData).select().single()

    if (error) {
      console.error("[v0] Event creation error:", error)
      return NextResponse.json(
        {
          message: "Failed to create event",
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Event created successfully:", newEvent.id)

    // Handle ticket types if provided
    if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
      console.log("[v0] Creating ticket types:", eventData.ticketTypes.length)

      const ticketInserts = eventData.ticketTypes.map((ticket: any) => ({
        event_id: newEvent.id,
        name: ticket.name || "General Admission",
        description: ticket.description || "",
        price: Number.parseFloat(ticket.price) || 0,
        quantity_available: Number.parseInt(ticket.quantity) || 0,
        quantity_sold: 0,
        sale_start_date: ticket.saleStartDate ? new Date(ticket.saleStartDate).toISOString() : new Date().toISOString(),
        sale_end_date: ticket.saleEndDate
          ? new Date(ticket.saleEndDate).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
      }))

      const { error: ticketError } = await supabase.from("ticket_types").insert(ticketInserts)

      if (ticketError) {
        console.error("[v0] Ticket creation error:", ticketError)
        // Don't fail the entire request, just log the error
      } else {
        console.log("[v0] Tickets created successfully")
      }
    }

    return NextResponse.json(newEvent)
  } catch (error) {
    console.error("[v0] Event creation error:", error)
    return NextResponse.json(
      {
        message: "Failed to create event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let query = supabase.from("events").select("*").order("created_at", { ascending: false })

    if (userId) {
      query = query.eq("user_id", userId)
    } else {
      query = query.eq("is_published", true)
    }

    const { data: events, error } = await query

    if (error) {
      console.error("Events fetch error:", error)
      return NextResponse.json({ message: "Failed to fetch events" }, { status: 500 })
    }

    return NextResponse.json(events)
  } catch (error) {
    console.error("Events fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch events" }, { status: 500 })
  }
}
