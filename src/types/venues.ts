
export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  is_active: boolean;
  has_rooms: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenueRoom {
  id: string;
  venue_id: string;
  name: string;
  rows: number;
  columns: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  venue?: Venue;
}

export interface RoomSeat {
  id: string;
  room_id: string;
  row_number: number;
  column_number: number;
  label: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}
