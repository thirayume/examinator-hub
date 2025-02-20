
import { DashboardLayout } from "@/components/DashboardLayout";
import { Calendar, Plus, Search, Users, MapPin, Clock } from "lucide-react";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  availableSeats: number;
  totalSeats: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Placeholder data - will be replaced with actual API calls
  const events: Event[] = [
    {
      id: "1",
      title: "TOEIC Examination - Morning Session",
      date: "2024-04-15",
      time: "09:00 - 12:00",
      venue: "Main Building - Room 101",
      availableSeats: 25,
      totalSeats: 30,
      status: "upcoming"
    },
    {
      id: "2",
      title: "TOEFL Test - Afternoon Session",
      date: "2024-04-15",
      time: "14:00 - 17:00",
      venue: "Main Building - Room 102",
      availableSeats: 15,
      totalSeats: 30,
      status: "upcoming"
    }
  ];

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Events</h1>
          <button
            onClick={() => {/* Implementation coming in next iteration */}}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search events..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="bg-card rounded-lg shadow p-6 card-hover">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  {event.availableSeats} seats available
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                <button className="btn-primary">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <p className="text-muted-foreground">No events found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Events;
