"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { EventCreationWizard } from "@/components/events/event-creation-wizard"

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <EventCreationWizard />
      </div>
    </ProtectedRoute>
  )
}
