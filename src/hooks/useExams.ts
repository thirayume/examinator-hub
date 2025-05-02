
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExamType, ExamSection, ExamSchedule } from '@/types/exams';

export function useExamTypes() {
  return useQuery({
    queryKey: ['examTypes'],
    queryFn: async (): Promise<ExamType[]> => {
      const { data, error } = await supabase
        .from('exam_types')
        .select('*')
        .order('code');

      if (error) throw error;
      return data;
    },
  });
}

export function useExamType(id: string | undefined) {
  return useQuery({
    queryKey: ['examType', id],
    queryFn: async (): Promise<ExamType> => {
      if (!id) throw new Error('Exam type ID is required');
      
      const { data, error } = await supabase
        .from('exam_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useExamSections(examTypeId: string | undefined) {
  return useQuery({
    queryKey: ['examSections', examTypeId],
    queryFn: async (): Promise<ExamSection[]> => {
      if (!examTypeId) return [];
      
      const { data, error } = await supabase
        .from('exam_sections')
        .select('*')
        .eq('exam_type_id', examTypeId)
        .order('sort_order');

      if (error) throw error;
      return data;
    },
    enabled: !!examTypeId,
  });
}

export function useExamSchedules(filters?: {
  status?: string;
  examTypeId?: string;
  fromDate?: string;
  toDate?: string;
}) {
  return useQuery({
    queryKey: ['examSchedules', filters],
    queryFn: async (): Promise<ExamSchedule[]> => {
      let query = supabase
        .from('exam_schedules')
        .select('*, exam_type:exam_type_id(*)');
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.examTypeId) {
        query = query.eq('exam_type_id', filters.examTypeId);
      }
      
      if (filters?.fromDate) {
        query = query.gte('date', filters.fromDate);
      }
      
      if (filters?.toDate) {
        query = query.lte('date', filters.toDate);
      }
      
      const { data, error } = await query.order('date', { ascending: true });

      if (error) throw error;
      return data as unknown as ExamSchedule[];
    },
  });
}

export function useExamSchedule(id: string | undefined) {
  return useQuery({
    queryKey: ['examSchedule', id],
    queryFn: async (): Promise<ExamSchedule> => {
      if (!id) throw new Error('Exam schedule ID is required');
      
      const { data, error } = await supabase
        .from('exam_schedules')
        .select('*, exam_type:exam_type_id(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as ExamSchedule;
    },
    enabled: !!id,
  });
}

export function useCreateExamType() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (examType: Omit<ExamType, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('exam_types')
        .insert(examType)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examTypes'] });
    },
  });
}

export function useCreateExamSection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (section: Omit<ExamSection, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('exam_sections')
        .insert(section)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['examSections', variables.exam_type_id] });
    },
  });
}

export function useCreateExamSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schedule: Omit<ExamSchedule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('exam_schedules')
        .insert(schedule)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examSchedules'] });
    },
  });
}

export function useUpdateExamSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<ExamSchedule>) => {
      const { data, error } = await supabase
        .from('exam_schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['examSchedules'] });
      queryClient.invalidateQueries({ queryKey: ['examSchedule', variables.id] });
    },
  });
}
