export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      journal_entries: {
        Row: {
          created_at: string
          energy: number | null
          entry_date: string
          id: string
          motivation: number | null
          notes: string | null
          soreness: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          energy?: number | null
          entry_date?: string
          id?: string
          motivation?: number | null
          notes?: string | null
          soreness?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          energy?: number | null
          entry_date?: string
          id?: string
          motivation?: number | null
          notes?: string | null
          soreness?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      oura_connections: {
        Row: {
          access_token: string
          connected_at: string
          created_at: string
          id: string
          last_synced_at: string | null
          token_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          connected_at?: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          token_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          connected_at?: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          token_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      oura_daily: {
        Row: {
          created_at: string
          hrv_avg: number | null
          id: string
          metric_date: string
          raw: Json | null
          readiness_score: number | null
          resting_hr: number | null
          sleep_score: number | null
          total_sleep_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hrv_avg?: number | null
          id?: string
          metric_date: string
          raw?: Json | null
          readiness_score?: number | null
          resting_hr?: number | null
          sleep_score?: number | null
          total_sleep_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hrv_avg?: number | null
          id?: string
          metric_date?: string
          raw?: Json | null
          readiness_score?: number | null
          resting_hr?: number | null
          sleep_score?: number | null
          total_sleep_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          coaching_tone: string | null
          created_at: string
          display_name: string | null
          equipment: string[] | null
          experience: string | null
          goal: string | null
          id: string
          onboarding_complete: boolean
          session_length: string | null
          soreness_baseline: string | null
          split: string | null
          training_days: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          coaching_tone?: string | null
          created_at?: string
          display_name?: string | null
          equipment?: string[] | null
          experience?: string | null
          goal?: string | null
          id?: string
          onboarding_complete?: boolean
          session_length?: string | null
          soreness_baseline?: string | null
          split?: string | null
          training_days?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          coaching_tone?: string | null
          created_at?: string
          display_name?: string | null
          equipment?: string[] | null
          experience?: string | null
          goal?: string | null
          id?: string
          onboarding_complete?: boolean
          session_length?: string | null
          soreness_baseline?: string | null
          split?: string | null
          training_days?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          completed: boolean
          created_at: string
          duration_minutes: number | null
          exercises: Json | null
          focus: string | null
          id: string
          intensity: string | null
          recovery_label: string | null
          updated_at: string
          user_id: string
          workout_date: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          duration_minutes?: number | null
          exercises?: Json | null
          focus?: string | null
          id?: string
          intensity?: string | null
          recovery_label?: string | null
          updated_at?: string
          user_id: string
          workout_date?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          duration_minutes?: number | null
          exercises?: Json | null
          focus?: string | null
          id?: string
          intensity?: string | null
          recovery_label?: string | null
          updated_at?: string
          user_id?: string
          workout_date?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
