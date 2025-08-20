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

    // Get user's wallet balance from users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("wallet_balance")
      .eq("id", userId)
      .single()

    if (userError) {
      console.error("User balance fetch error:", userError)
      return NextResponse.json({ message: "Failed to fetch wallet balance" }, { status: 500 })
    }

    return NextResponse.json({ 
      balance: userData?.wallet_balance || 0 
    })
  } catch (error) {
    console.error("Wallet balance error:", error)
    return NextResponse.json({ message: "Failed to fetch wallet balance" }, { status: 500 })
  }
}
