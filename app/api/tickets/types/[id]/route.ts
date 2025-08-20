import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const ticketData = await request.json()

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify user owns the ticket type through the event
    const { data: ticketType, error: ticketError } = await supabase
      .from("ticket_types")
      .select(`
        *,
        events (
          user_id
        )
      `)
      .eq("id", params.id)
      .single()

    if (ticketError || !ticketType || ticketType.events?.user_id !== user.id) {
      return NextResponse.json({ message: "Ticket type not found or unauthorized" }, { status: 404 })
    }

    const updateData = {
      name: ticketData.name,
      description: ticketData.description,
      price: parseFloat(ticketData.price) || 0,
      quantity_available: parseInt(ticketData.quantity) || 0,
      sale_start_date: ticketData.saleStartDate,
      sale_end_date: ticketData.saleEndDate,
      is_active: ticketData.isActive !== false,
      updated_at: new Date().toISOString()
    }

    const { data: updatedTicketType, error } = await supabase
      .from("ticket_types")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Ticket type update error:", error)
      return NextResponse.json({ message: "Failed to update ticket type" }, { status: 500 })
    }

    return NextResponse.json(updatedTicketType)
  } catch (error) {
    console.error("Ticket type update error:", error)
    return NextResponse.json({ message: "Failed to update ticket type" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify user owns the ticket type through the event
    const { data: ticketType, error: ticketError } = await supabase
      .from("ticket_types")
      .select(`
        *,
        events (
          user_id
        )
      `)
      .eq("id", params.id)
      .single()

    if (ticketError || !ticketType || ticketType.events?.user_id !== user.id) {
      return NextResponse.json({ message: "Ticket type not found or unauthorized" }, { status: 404 })
    }

    // Check if any tickets have been sold
    if (ticketType.quantity_sold > 0) {
      return NextResponse.json(
        { message: "Cannot delete ticket type with existing sales" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("ticket_types")
      .delete()
      .eq("id", params.id)

    if (error) {
      console.error("Ticket type deletion error:", error)
      return NextResponse.json({ message: "Failed to delete ticket type" }, { status: 500 })
    }

    return NextResponse.json({ message: "Ticket type deleted successfully" })
  } catch (error) {
    console.error("Ticket type deletion error:", error)
    return NextResponse.json({ message: "Failed to delete ticket type" }, { status: 500 })
  }
}
