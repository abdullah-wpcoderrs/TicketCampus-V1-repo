import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get wallet transactions for the user
    const { data: transactions, error } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Wallet transactions fetch error:", error)
      return NextResponse.json({ message: "Failed to fetch transactions" }, { status: 500 })
    }

    return NextResponse.json(transactions || [])
  } catch (error) {
    console.error("Wallet transactions error:", error)
    return NextResponse.json({ message: "Failed to fetch transactions" }, { status: 500 })
  }
}
