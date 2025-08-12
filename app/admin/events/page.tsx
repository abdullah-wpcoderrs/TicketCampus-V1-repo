import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"

export default function AdminEvents() {
  const events = [
    {
      id: 1,
      title: "Tech Conference 2024",
      organizer: "John Doe",
      date: "2024-03-15",
      status: "published",
      attendees: 150,
      revenue: "₦450,000",
    },
    {
      id: 2,
      title: "Marketing Workshop",
      organizer: "Jane Smith",
      date: "2024-03-20",
      status: "draft",
      attendees: 0,
      revenue: "₦0",
    },
    // Add more mock events...
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Event Management</h2>
          <p className="text-muted-foreground">Manage all events on the platform.</p>
        </div>
        <Button>Create Event</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge variant={event.status === "published" ? "default" : "secondary"}>{event.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>By {event.organizer}</span>
                    <span>{event.date}</span>
                    <span>{event.attendees} attendees</span>
                    <span>{event.revenue}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
