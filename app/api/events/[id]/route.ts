import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: event, error } = await supabase
      .from("events")
      .select("*, banner_image_url") // explicitly select banner_image_url
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const formData = await request.json()

    // Map form data to database fields
    const eventData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      event_type: formData.eventType,
      start_date: formData.startDate,
      end_date: formData.endDate,
      start_time: formData.startTime,
      end_time: formData.endTime,
      timezone: formData.timezone,
      is_online: formData.isOnline,
      venue_name: formData.venueName,
      venue_address: formData.venueAddress,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      meeting_link: formData.meetingLink,
      max_capacity: formData.maxCapacity,
      requires_approval: formData.requiresApproval,
      allow_guest_registration: formData.allowGuestRegistration,
      slug: formData.slug,
      meta_description: formData.metaDescription,
      updated_at: new Date().toISOString(),
    }

    const { data: event, error } = await supabase
      .from("events")
      .update(eventData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Event update error:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}