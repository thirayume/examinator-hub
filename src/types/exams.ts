
export interface ExamType {
  id: string;
  code: string;
  name_key: string; 
  description_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExamSection {
  id: string;
  exam_type_id: string;
  name_key: string;
  duration_minutes: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExamSchedule {
  id: string;
  exam_type_id: string;
  title: string;
  date: string;
  registration_deadline: string;
  price: number;
  min_candidates: number | null;
  max_candidates: number | null;
  status: string; // Changed from specific string literals to accept any string value
  created_at: string;
  updated_at: string;
  exam_type?: ExamType;
}

export interface ExamScheduleRoom {
  id: string;
  exam_schedule_id: string;
  room_id: string;
  start_time: string;
  created_at: string;
  updated_at: string;
}

import { VenueRoom, RoomSeat } from '@/types/venues';

export interface Registration {
  id: string;
  user_id: string;
  exam_schedule_id: string;
  room_id: string | null;
  seat_id: string | null;
  payment_status: string; // Changed from specific string literals to accept any string value
  payment_method: string | null;
  payment_reference: string | null;
  registration_code: string;
  status: string; // Changed from specific string literals to accept any string value
  created_at: string;
  updated_at: string;
  exam_schedule?: ExamSchedule;
  room?: VenueRoom;
  seat?: RoomSeat;
}
