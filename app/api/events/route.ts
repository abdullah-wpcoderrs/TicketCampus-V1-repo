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
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        start_time: eventData.startTime,
        end_time: eventData.endTime,
        timezone: eventData.timezone,
        location_type: eventData.locationType,
        venue_name: eventData.venueName,
        venue_address: eventData.venueAddress,
        online_link: eventData.onlineLink,
        banner_image: eventData.bannerImage,
        gallery_images: eventData.galleryImages,
        max_attendees: eventData.maxAttendees,
        is_published: false,
        allow_guest_registration: eventData.allowGuestRegistration || false,
        require_approval: eventData.requireApproval || false,
        send_reminders: eventData.sendReminders || true,
        custom_fields: eventData.customFields || [],
        social_links: eventData.socialLinks || {},
        organizer_info: eventData.organizerInfo || {},
      })
      .select()
      .single()

    if (error) {
      console.error("Event creation error:", error)
      return NextResponse.json({ message: "Failed to create event" }, { status: 500 })
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
