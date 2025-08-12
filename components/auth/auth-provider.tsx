"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  walletBalance: number
  isVerified: boolean
  isAdmin: boolean
  createdAt?: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<{ message: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

interface SignupData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user)
        if (event === "SIGNED_IN") {
          router.push("/dashboard")
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  const getInitialSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user) {
      await fetchUserProfile(session.user)
    }
    setLoading(false)
  }

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", supabaseUser.id).maybeSingle() // Use maybeSingle() instead of single() to handle no results gracefully

      if (error) {
        console.error("Error fetching user profile:", error)
        return
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          avatarUrl: data.avatar_url,
          walletBalance: data.wallet_balance || 0,
          isVerified: data.is_verified || false,
          isAdmin: data.is_admin || false,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        })
      } else {
        console.log("User profile not found, user may need to complete signup process")
        setUser(null)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      // The onAuthStateChange callback will handle setting the user and redirecting
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signup = async (data: SignupData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    })

    if (authError) {
      throw new Error(authError.message)
    }

    return { message: "Please check your email to confirm your account before signing in." }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    const { error } = await supabase
      .from("users")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        avatar_url: data.avatarUrl,
      })
      .eq("id", user.id)

    if (error) {
      throw new Error(error.message)
    }

    setUser((prev) => (prev ? { ...prev, ...data } : null))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
