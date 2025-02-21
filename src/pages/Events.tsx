
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Search, Users, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Event, Venue, EventTimeSlot } from "@/types/events";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    exam_type: "TOEIC" as Event["exam_type"],
    venue_id: "",
    event_date: "",
    registration_deadline: "",
    price: 0,
    timeSlots: [{ start_time: "", end_time: "", available_seats: 30, total_seats: 30 }],
    notificationDays: [7, 3, 1]
  });

  useEffect(() => {
    fetchEvents();
    fetchVenues();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          venue:venues(*)
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;
      
      // Cast both exam_type and status to ensure they match our type
      const typedEvents = data?.map(event => ({
        ...event,
        exam_type: event.exam_type as Event["exam_type"],
        status: event.status as Event["status"]
      }));

      setEvents(typedEvents || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load events: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("is_active", true)
        .order('name');

      if (error) throw error;
      setVenues(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load venues: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First create the event
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .insert({
          title: formData.title,
          exam_type: formData.exam_type,
          venue_id: formData.venue_id,
          event_date: formData.event_date,
          registration_deadline: formData.registration_deadline,
          price: formData.price,
          status: 'upcoming' as const
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Then create time slots
      const timeSlotPromises = formData.timeSlots.map(slot => 
        supabase.from("event_time_slots").insert({
          event_id: eventData.id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          available_seats: slot.available_seats,
          total_seats: slot.total_seats
        })
      );

      // Create notification settings
      const notificationPromises = formData.notificationDays.map(days =>
        supabase.from("event_notifications").insert({
          event_id: eventData.id,
          days_before: days
        })
      );

      await Promise.all([...timeSlotPromises, ...notificationPromises]);

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      setIsCreateDialogOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create event: " + error.message,
        variant: "destructive",
      });
    }
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { start_time: "", end_time: "", available_seats: 30, total_seats: 30 }]
    }));
  };

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

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.exam_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Events</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Create Event Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Exam Type</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.exam_type}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      exam_type: e.target.value as Event["exam_type"]
                    }))}
                  >
                    <option value="TOEIC">TOEIC</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <Label>Event Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., TOEIC Morning Session"
                  />
                </div>

                <div>
                  <Label>Venue</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.venue_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue_id: e.target.value }))}
                  >
                    <option value="">Select a venue</option>
                    {venues.map(venue => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} (Capacity: {venue.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Event Date</Label>
                  <Input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Registration Deadline</Label>
                  <Input
                    type="date"
                    value={formData.registration_deadline}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      registration_deadline: e.target.value 
                    }))}
                  />
                </div>

                <div>
                  <Label>Price (THB)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      price: parseFloat(e.target.value) 
                    }))}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Time Slots</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTimeSlot}
                      className="text-sm"
                    >
                      Add Time Slot
                    </Button>
                  </div>
                  {formData.timeSlots.map((slot, index) => (
                    <div key={index} className="flex gap-4 mb-2">
                      <div className="flex-1">
                        <Input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) => {
                            const newSlots = [...formData.timeSlots];
                            newSlots[index].start_time = e.target.value;
                            setFormData(prev => ({ ...prev, timeSlots: newSlots }));
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) => {
                            const newSlots = [...formData.timeSlots];
                            newSlots[index].end_time = e.target.value;
                            setFormData(prev => ({ ...prev, timeSlots: newSlots }));
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="Seats"
                          value={slot.available_seats}
                          onChange={(e) => {
                            const newSlots = [...formData.timeSlots];
                            newSlots[index].available_seats = parseInt(e.target.value);
                            newSlots[index].total_seats = parseInt(e.target.value);
                            setFormData(prev => ({ ...prev, timeSlots: newSlots }));
                          }}
                          min="1"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Label>Notification Days (before event)</Label>
                  <Input
                    value={formData.notificationDays.join(", ")}
                    onChange={(e) => {
                      const days = e.target.value.split(",")
                        .map(d => parseInt(d.trim()))
                        .filter(d => !isNaN(d));
                      setFormData(prev => ({ ...prev, notificationDays: days }));
                    }}
                    placeholder="e.g., 7, 3, 1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter days separated by commas (e.g., 7, 3, 1)
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
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
                  {new Date(event.event_date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.venue?.name}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  Registration deadline: {new Date(event.registration_deadline).toLocaleDateString()}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  Price: ฿{event.price.toLocaleString()}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                <Button>
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <p className="text-muted-foreground">No events found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Events;
