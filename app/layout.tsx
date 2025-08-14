import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Anek_Tamil } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anek-tamil",
})

export const metadata: Metadata = {
  title: "Ticket - Event Management Platform",
  description: "Create, manage and promote your events with ease",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${anekTamil.variable} antialiased`}>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
