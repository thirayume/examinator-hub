
export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  exam_type: "TOEIC" | "TOEFL" | "OTHER";
  venue_id: string;
  event_date: string;
  registration_deadline: string;
  price: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  venue?: Venue;
}

export interface EventTimeSlot {
  id: string;
  event_id: string;
  start_time: string;
  end_time: string;
  available_seats: number;
  total_seats: number;
  created_at: string;
  updated_at: string;
}

export interface EventNotification {
  id: string;
  event_id: string;
  days_before: number;
  created_at: string;
  updated_at: string;
}
