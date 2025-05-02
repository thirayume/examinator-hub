
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Registration } from '@/types/exams';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';

export function useUserRegistrations() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['userRegistrations'],
    queryFn: async (): Promise<Registration[]> => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to view your registrations",
          variant: "destructive",
        });
        return [];
      }
      
      const userId = userData.user.id;
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          exam_schedule:exam_schedule_id(
            *,
            exam_type:exam_type_id(*)
          ),
          room:room_id(*),
          seat:seat_id(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch registrations: " + error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data as unknown as Registration[];
    },
  });
}

export function useRegistration(id: string | undefined) {
  return useQuery({
    queryKey: ['registration', id],
    queryFn: async (): Promise<Registration> => {
      if (!id) throw new Error('Registration ID is required');
      
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          exam_schedule:exam_schedule_id(
            *,
            exam_type:exam_type_id(*)
          ),
          room:room_id(*),
          seat:seat_id(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as Registration;
    },
    enabled: !!id,
  });
}

export function useCreateRegistration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (registrationData: {
      exam_schedule_id: string;
      room_id?: string;
      seat_id?: string;
    }) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error("User authentication required");
      
      const userId = userData.user.id;
      const registrationCode = nanoid(8).toUpperCase();
      
      const registration = {
        user_id: userId,
        registration_code: registrationCode,
        ...registrationData
      };
      
      const { data, error } = await supabase
        .from('registrations')
        .insert(registration)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
      toast({
        title: "Registration Created",
        description: `Your registration code is: ${data.registration_code}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Registration>) => {
      const { data, error } = await supabase
        .from('registrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['registration', variables.id] });
    },
  });
}
