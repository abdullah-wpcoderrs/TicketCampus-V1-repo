import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const eventData = await request.json()

    const { data: newEvent, error } = await supabase
      .from("events")
      .insert({
        user_id: user.id,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        slug: eventData.slug || eventData.title.toLowerCase().replace(/\s+/g, "-"),
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        start_time: eventData.startTime,
        end_time: eventData.endTime,
        timezone: eventData.timezone,
        is_online: eventData.isOnline,
        venue_name: eventData.venueName,
        venue_address: eventData.venueAddress,
        city: eventData.city,
        state: eventData.state,
        country: eventData.country,
        meeting_link: eventData.meetingLink,
        banner_image: eventData.bannerImage,
        gallery_images: eventData.galleryImages,
        max_capacity: eventData.maxCapacity,
        is_published: true,
        allow_guest_registration: eventData.allowGuestRegistration || false,
        requires_approval: eventData.requiresApproval || false,
        custom_fields: eventData.customFields || [],
        event_type: eventData.eventType,
        meta_description: eventData.metaDescription,
        enable_promotions: eventData.enablePromotions || false,
        promotion_channels: eventData.promotionChannels || [],
        enable_getdp: eventData.enableGetDP || false,
        getdp_template: eventData.getdpTemplate || null,
        whatsapp_messages: eventData.whatsappMessages || null,
        email_messages: eventData.emailMessages || null,
        auto_send_confirmation: eventData.autoSendConfirmation || true,
        auto_send_reminders: eventData.autoSendReminders || false,
        reminder_timing: eventData.reminderTiming || "24h",
      })
      .select()
      .single()

    if (error) {
      console.error("Event creation error:", error)
      return NextResponse.json({ message: "Failed to create event", error: error.message }, { status: 500 })
    }

    if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
      const ticketInserts = eventData.ticketTypes.map((ticket: any) => ({
        event_id: newEvent.id,
        name: ticket.name,
        description: ticket.description,
        price: ticket.price,
        quantity: ticket.quantity,
        sale_start_date: ticket.saleStartDate,
        sale_end_date: ticket.saleEndDate,
      }))

      await supabase.from("ticket_types").insert(ticketInserts)
    }

    return NextResponse.json(newEvent)
  } catch (error) {
    console.error("Event creation error:", error)
    return NextResponse.json({ message: "Failed to create event" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
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
