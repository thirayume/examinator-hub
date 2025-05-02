
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VenueRoom } from '@/types/venues';

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
