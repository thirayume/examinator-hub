export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      banners: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean | null
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean | null
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_notifications: {
        Row: {
          created_at: string
          days_before: number
          event_id: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          days_before: number
          event_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          days_before?: number
          event_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_time_slots: {
        Row: {
          available_seats: number
          created_at: string
          end_time: string
          event_id: string
          id: string
          start_time: string
          total_seats: number
          updated_at: string
        }
        Insert: {
          available_seats: number
          created_at?: string
          end_time: string
          event_id: string
          id?: string
          start_time: string
          total_seats: number
          updated_at?: string
        }
        Update: {
          available_seats?: number
          created_at?: string
          end_time?: string
          event_id?: string
          id?: string
          start_time?: string
          total_seats?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_time_slots_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          event_date: string
          exam_type: string
          id: string
          price: number
          registration_deadline: string
          status: string
          title: string
          updated_at: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          event_date: string
          exam_type: string
          id?: string
          price: number
          registration_deadline: string
          status?: string
          title: string
          updated_at?: string
          venue_id: string
        }
        Update: {
          created_at?: string
          event_date?: string
          exam_type?: string
          id?: string
          price?: number
          registration_deadline?: string
          status?: string
          title?: string
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_schedule_rooms: {
        Row: {
          created_at: string
          exam_schedule_id: string
          id: string
          room_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exam_schedule_id: string
          id?: string
          room_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exam_schedule_id?: string
          id?: string
          room_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_schedule_rooms_exam_schedule_id_fkey"
            columns: ["exam_schedule_id"]
            isOneToOne: false
            referencedRelation: "exam_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_schedule_rooms_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "venue_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_schedules: {
        Row: {
          created_at: string
          date: string
          exam_type_id: string
          id: string
          max_candidates: number | null
          min_candidates: number | null
          price: number
          registration_deadline: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          exam_type_id: string
          id?: string
          max_candidates?: number | null
          min_candidates?: number | null
          price: number
          registration_deadline: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          exam_type_id?: string
          id?: string
          max_candidates?: number | null
          min_candidates?: number | null
          price?: number
          registration_deadline?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_schedules_exam_type_id_fkey"
            columns: ["exam_type_id"]
            isOneToOne: false
            referencedRelation: "exam_types"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_sections: {
        Row: {
          created_at: string
          duration_minutes: number
          exam_type_id: string
          id: string
          name_key: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes: number
          exam_type_id: string
          id?: string
          name_key: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          exam_type_id?: string
          id?: string
          name_key?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_sections_exam_type_id_fkey"
            columns: ["exam_type_id"]
            isOneToOne: false
            referencedRelation: "exam_types"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_types: {
        Row: {
          code: string
          created_at: string
          description_key: string | null
          id: string
          name_key: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description_key?: string | null
          id?: string
          name_key: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description_key?: string | null
          id?: string
          name_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_published: boolean | null
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          created_at: string
          exam_schedule_id: string
          id: string
          payment_method: string | null
          payment_reference: string | null
          payment_status: string
          registration_code: string
          room_id: string | null
          seat_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exam_schedule_id: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          registration_code: string
          room_id?: string | null
          seat_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exam_schedule_id?: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          registration_code?: string
          room_id?: string | null
          seat_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_exam_schedule_id_fkey"
            columns: ["exam_schedule_id"]
            isOneToOne: false
            referencedRelation: "exam_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "venue_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "room_seats"
            referencedColumns: ["id"]
          },
        ]
      }
      room_seats: {
        Row: {
          column_number: number
          created_at: string
          id: string
          is_available: boolean
          label: string | null
          room_id: string
          row_number: number
          updated_at: string
        }
        Insert: {
          column_number: number
          created_at?: string
          id?: string
          is_available?: boolean
          label?: string | null
          room_id: string
          row_number: number
          updated_at?: string
        }
        Update: {
          column_number?: number
          created_at?: string
          id?: string
          is_available?: boolean
          label?: string | null
          room_id?: string
          row_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_seats_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "venue_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      venue_rooms: {
        Row: {
          columns: number
          created_at: string
          id: string
          is_active: boolean
          name: string
          rows: number
          updated_at: string
          venue_id: string
        }
        Insert: {
          columns?: number
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          rows?: number
          updated_at?: string
          venue_id: string
        }
        Update: {
          columns?: number
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          rows?: number
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_rooms_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string
          capacity: number
          created_at: string
          has_rooms: boolean | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          address: string
          capacity: number
          created_at?: string
          has_rooms?: boolean | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          address?: string
          capacity?: number
          created_at?: string
          has_rooms?: boolean | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          created_at: string
          hero_subtitle: string
          hero_title: string
          id: string
          institute_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          institute_name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          institute_name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "staff" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "staff", "student"],
    },
  },
} as const
