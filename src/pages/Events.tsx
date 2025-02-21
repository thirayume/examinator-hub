import { DashboardLayout } from "@/components/DashboardLayout";
import { Calendar, Plus, Search, Users, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

interface TimeSlot {
  startTime: string;
  endTime: string;
  availableSeats: number;
}

interface EventFormData {
  title: string;
  date: string;
  timeSlots: TimeSlot[];
  venue: string;
  notificationDays: number[];
  examType: "TOEIC" | "TOEFL" | "OTHER";
  registrationDeadline: string;
  price: number;
}

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    date: "",
    timeSlots: [{ startTime: "", endTime: "", availableSeats: 30 }],
    venue: "",
    notificationDays: [7, 3, 1],
    examType: "TOEIC",
    registrationDeadline: "",
    price: 0
  });
  
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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement event creation with API
    console.log("Creating event:", formData);
    setIsCreateDialogOpen(false);
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: "", endTime: "", availableSeats: 30 }]
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Events</h1>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>

        {/* Create Event Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Exam Type</label>
                  <select 
                    className="input-field"
                    value={formData.examType}
                    onChange={(e) => setFormData(prev => ({ ...prev, examType: e.target.value as EventFormData["examType"] }))}
                  >
                    <option value="TOEIC">TOEIC</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Event Title</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., TOEIC Morning Session"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Event Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Venue</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.venue}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="e.g., Main Building - Room 101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Registration Deadline</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price (THB)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Time Slots</label>
                    <button
                      type="button"
                      onClick={addTimeSlot}
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      + Add Time Slot
                    </button>
                  </div>
                  {formData.timeSlots.map((slot, index) => (
                    <div key={index} className="flex gap-4 mb-2">
                      <input
                        type="time"
                        className="input-field"
                        value={slot.startTime}
                        onChange={(e) => {
                          const newSlots = [...formData.timeSlots];
                          newSlots[index].startTime = e.target.value;
                          setFormData(prev => ({ ...prev, timeSlots: newSlots }));
                        }}
                      />
                      <input
                        type="time"
                        className="input-field"
                        value={slot.endTime}
                        onChange={(e) => {
                          const newSlots = [...formData.timeSlots];
                          newSlots[index].endTime = e.target.value;
                          setFormData(prev => ({ ...prev, timeSlots: newSlots }));
                        }}
                      />
                      <input
                        type="number"
                        className="input-field"
                        placeholder="Seats"
                        value={slot.availableSeats}
                        onChange={(e) => {
                          const newSlots = [...formData.timeSlots];
                          newSlots[index].availableSeats = parseInt(e.target.value);
                          setFormData(prev => ({ ...prev, timeSlots: newSlots }));
                        }}
                        min="1"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notification Days (before event)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input-field"
                      value={formData.notificationDays.join(", ")}
                      onChange={(e) => {
                        const days = e.target.value.split(",").map(d => parseInt(d.trim())).filter(d => !isNaN(d));
                        setFormData(prev => ({ ...prev, notificationDays: days }));
                      }}
                      placeholder="e.g., 7, 3, 1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Enter days separated by commas (e.g., 7, 3, 1)</p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Create Event
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

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
