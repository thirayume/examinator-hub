
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RoomSeat } from '@/types/venues';

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
