"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { EditEventWizard } from "@/components/events/edit-event-wizard"

export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <EditEventWizard eventId={params.id} />
      </div>
    </ProtectedRoute>
  )
}