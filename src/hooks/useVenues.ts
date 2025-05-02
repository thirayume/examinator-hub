
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Venue, VenueRoom, RoomSeat } from '@/types/venues';

export function useVenues(onlyActive = true) {
  return useQuery({
    queryKey: ['venues', { onlyActive }],
    queryFn: async (): Promise<Venue[]> => {
      let query = supabase.from('venues').select('*');
      
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query.order('name');

      if (error) throw error;
      return data;
    },
  });
}

export function useVenue(id: string | undefined) {
  return useQuery({
    queryKey: ['venue', id],
    queryFn: async (): Promise<Venue> => {
      if (!id) throw new Error('Venue ID is required');
      
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useVenueRooms(venueId: string | undefined) {
  return useQuery({
    queryKey: ['venueRooms', venueId],
    queryFn: async (): Promise<VenueRoom[]> => {
      if (!venueId) return [];
      
      const { data, error } = await supabase
        .from('venue_rooms')
        .select('*')
        .eq('venue_id', venueId)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: !!venueId,
  });
}

export function useVenueRoom(id: string | undefined) {
  return useQuery({
    queryKey: ['venueRoom', id],
    queryFn: async (): Promise<VenueRoom> => {
      if (!id) throw new Error('Room ID is required');
      
      const { data, error } = await supabase
        .from('venue_rooms')
        .select('*, venue:venue_id(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useRoomSeats(roomId: string | undefined) {
  return useQuery({
    queryKey: ['roomSeats', roomId],
    queryFn: async (): Promise<RoomSeat[]> => {
      if (!roomId) return [];
      
      const { data, error } = await supabase
        .from('room_seats')
        .select('*')
        .eq('room_id', roomId)
        .order('row_number')
        .order('column_number');

      if (error) throw error;
      return data;
    },
    enabled: !!roomId,
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (venue: Omit<Venue, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('venues')
        .insert(venue)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}

export function useUpdateVenue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Venue>) => {
      const { data, error } = await supabase
        .from('venues')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.invalidateQueries({ queryKey: ['venue', variables.id] });
    },
  });
}

export function useCreateVenueRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (room: Omit<VenueRoom, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('venue_rooms')
        .insert(room)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['venueRooms', data.venue_id] });
    },
  });
}

export function useUpdateVenueRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<VenueRoom>) => {
      const { data, error } = await supabase
        .from('venue_rooms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['venueRooms', data.venue_id] });
      queryClient.invalidateQueries({ queryKey: ['venueRoom', data.id] });
    },
  });
}

export function useCreateRoomSeats() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ roomId, rows, columns }: { roomId: string; rows: number; columns: number }) => {
      const seats = [];
      
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= columns; col++) {
          seats.push({
            room_id: roomId,
            row_number: row,
            column_number: col,
            label: `R${row}C${col}`,
            is_available: true
          });
        }
      }
      
      const { data, error } = await supabase
        .from('room_seats')
        .insert(seats)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roomSeats', variables.roomId] });
    },
  });
}

export function useUpdateRoomSeat() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, roomId, ...updates }: { id: string; roomId: string } & Partial<RoomSeat>) => {
      const { data, error } = await supabase
        .from('room_seats')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roomSeats', variables.roomId] });
    },
  });
}
