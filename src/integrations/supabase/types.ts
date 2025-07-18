export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          brand_competitors: string | null
          brand_crisis: string | null
          brand_differentials: string | null
          brand_inspiration: string | null
          brand_manual: number | null
          brand_mission: string | null
          brand_personality: string | null
          brand_pillars: string | null
          brand_promise: string | null
          brand_voice: string | null
          created_at: string | null
          id: number
          influencers_action: number | null
          is_deleted: number | null
          name: string
          target_audience: string | null
          team_id: number | null
          updated_at: string | null
          user_id: string
          value_proposition: string | null
        }
        Insert: {
          brand_competitors?: string | null
          brand_crisis?: string | null
          brand_differentials?: string | null
          brand_inspiration?: string | null
          brand_manual?: number | null
          brand_mission?: string | null
          brand_personality?: string | null
          brand_pillars?: string | null
          brand_promise?: string | null
          brand_voice?: string | null
          created_at?: string | null
          id?: number
          influencers_action?: number | null
          is_deleted?: number | null
          name: string
          target_audience?: string | null
          team_id?: number | null
          updated_at?: string | null
          user_id: string
          value_proposition?: string | null
        }
        Update: {
          brand_competitors?: string | null
          brand_crisis?: string | null
          brand_differentials?: string | null
          brand_inspiration?: string | null
          brand_manual?: number | null
          brand_mission?: string | null
          brand_personality?: string | null
          brand_pillars?: string | null
          brand_promise?: string | null
          brand_voice?: string | null
          created_at?: string | null
          id?: number
          influencers_action?: number | null
          is_deleted?: number | null
          name?: string
          target_audience?: string | null
          team_id?: number | null
          updated_at?: string | null
          user_id?: string
          value_proposition?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      content_plans: {
        Row: {
          ai_suggestions: string | null
          brand_id: number | null
          content_types: string[] | null
          created_at: string
          description: string | null
          duration_days: number | null
          frequency: string | null
          id: string
          objectives: string[] | null
          platforms: string[] | null
          post_count: number | null
          target_audience: string | null
          team_id: number | null
          theme_id: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_suggestions?: string | null
          brand_id?: number | null
          content_types?: string[] | null
          created_at?: string
          description?: string | null
          duration_days?: number | null
          frequency?: string | null
          id?: string
          objectives?: string[] | null
          platforms?: string[] | null
          post_count?: number | null
          target_audience?: string | null
          team_id?: number | null
          theme_id?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_suggestions?: string | null
          brand_id?: number | null
          content_types?: string[] | null
          created_at?: string
          description?: string | null
          duration_days?: number | null
          frequency?: string | null
          id?: string
          objectives?: string[] | null
          platforms?: string[] | null
          post_count?: number | null
          target_audience?: string | null
          team_id?: number | null
          theme_id?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_plans_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_plans_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_plans_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reviews: {
        Row: {
          ai_analysis: string | null
          brand_id: number | null
          content_image_url: string | null
          content_text: string | null
          content_video_url: string | null
          created_at: string
          engagement_tips: string | null
          id: string
          improvement_suggestions: string | null
          negative_points: string | null
          overall_score: number | null
          positive_points: string | null
          review_type: string
          team_id: number | null
          theme_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          brand_id?: number | null
          content_image_url?: string | null
          content_text?: string | null
          content_video_url?: string | null
          created_at?: string
          engagement_tips?: string | null
          id?: string
          improvement_suggestions?: string | null
          negative_points?: string | null
          overall_score?: number | null
          positive_points?: string | null
          review_type: string
          team_id?: number | null
          theme_id?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          brand_id?: number | null
          content_image_url?: string | null
          content_text?: string | null
          content_video_url?: string | null
          created_at?: string
          engagement_tips?: string | null
          id?: string
          improvement_suggestions?: string | null
          negative_points?: string | null
          overall_score?: number | null
          positive_points?: string | null
          review_type?: string
          team_id?: number | null
          theme_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reviews_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reviews_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reviews_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      contents: {
        Row: {
          brand_id: number | null
          content_type: string | null
          created_at: string | null
          feeling: string | null
          format: string | null
          id: number
          image_url: string | null
          main_message: string | null
          micro_result: string
          next_step: string | null
          plan_id: string | null
          platform: string | null
          response_ai: string | null
          scheduled_for: string | null
          status: string | null
          team_id: number | null
          theme_id: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          brand_id?: number | null
          content_type?: string | null
          created_at?: string | null
          feeling?: string | null
          format?: string | null
          id?: number
          image_url?: string | null
          main_message?: string | null
          micro_result: string
          next_step?: string | null
          plan_id?: string | null
          platform?: string | null
          response_ai?: string | null
          scheduled_for?: string | null
          status?: string | null
          team_id?: number | null
          theme_id?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          brand_id?: number | null
          content_type?: string | null
          created_at?: string | null
          feeling?: string | null
          format?: string | null
          id?: number
          image_url?: string | null
          main_message?: string | null
          micro_result?: string
          next_step?: string | null
          plan_id?: string | null
          platform?: string | null
          response_ai?: string | null
          scheduled_for?: string | null
          status?: string | null
          team_id?: number | null
          theme_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contents_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contents_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "content_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contents_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contents_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          age: number | null
          challenge: string | null
          created_at: string | null
          id: number
          interests: string[] | null
          location: string | null
          main_objective: string | null
          name: string
          pain_points: string[] | null
          position_degree: string | null
          preferred_platforms: string[] | null
          team_id: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          challenge?: string | null
          created_at?: string | null
          id?: number
          interests?: string[] | null
          location?: string | null
          main_objective?: string | null
          name: string
          pain_points?: string[] | null
          position_degree?: string | null
          preferred_platforms?: string[] | null
          team_id?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          challenge?: string | null
          created_at?: string | null
          id?: number
          interests?: string[] | null
          location?: string | null
          main_objective?: string | null
          name?: string
          pain_points?: string[] | null
          position_degree?: string | null
          preferred_platforms?: string[] | null
          team_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personas_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          current_team_id: number | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_team_id?: number | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_team_id?: number | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_team_id_fkey"
            columns: ["current_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          created_at: string | null
          id: number
          status: string
          team_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          status?: string
          team_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          status?: string
          team_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: number
          joined_at: string | null
          role: string
          status: string
          team_id: number
          user_id: string
        }
        Insert: {
          id?: number
          joined_at?: string | null
          role?: string
          status?: string
          team_id: number
          user_id: string
        }
        Update: {
          id?: number
          joined_at?: string | null
          role?: string
          status?: string
          team_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          admin_user_id: string
          created_at: string | null
          id: number
          name: string
          team_code: string
          updated_at: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          id?: number
          name: string
          team_code: string
          updated_at?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          id?: number
          name?: string
          team_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      themes: {
        Row: {
          created_at: string | null
          description: string | null
          hashtags: string[] | null
          id: number
          objectives: string[] | null
          team_id: number | null
          title: string
          updated_at: string | null
          user_id: string
          voice_ai: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hashtags?: string[] | null
          id?: number
          objectives?: string[] | null
          team_id?: number | null
          title: string
          updated_at?: string | null
          user_id: string
          voice_ai?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hashtags?: string[] | null
          id?: number
          objectives?: string[] | null
          team_id?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
          voice_ai?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "themes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_current_team_id: {
        Args: { _user_id: string }
        Returns: number
      }
      user_is_team_admin: {
        Args: { _team_id: number; _user_id: string }
        Returns: boolean
      }
      user_is_team_member: {
        Args: { _team_id: number; _user_id: string }
        Returns: boolean
      }
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
