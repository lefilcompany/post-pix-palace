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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          brand_competitors: string | null
          brand_crisis: string | null
          brand_differentials: string | null
          brand_hashtags: string | null
          brand_inspiration: string | null
          brand_manual: number | null
          brand_mission: string | null
          brand_personality: string | null
          brand_pillars: string | null
          brand_promise: string | null
          brand_voice: string | null
          created_at: string
          current_objective: string | null
          id: number
          important_dates: string | null
          influencers_action: number | null
          is_deleted: number
          name: string
          numeric_target: string | null
          reference_contents: string | null
          relevant_content: string | null
          restrictions: string | null
          target_audience: string | null
          team_id: number | null
          updated_at: string
          user_id: string
          value_proposition: string | null
        }
        Insert: {
          brand_competitors?: string | null
          brand_crisis?: string | null
          brand_differentials?: string | null
          brand_hashtags?: string | null
          brand_inspiration?: string | null
          brand_manual?: number | null
          brand_mission?: string | null
          brand_personality?: string | null
          brand_pillars?: string | null
          brand_promise?: string | null
          brand_voice?: string | null
          created_at?: string
          current_objective?: string | null
          id?: never
          important_dates?: string | null
          influencers_action?: number | null
          is_deleted?: number
          name: string
          numeric_target?: string | null
          reference_contents?: string | null
          relevant_content?: string | null
          restrictions?: string | null
          target_audience?: string | null
          team_id?: number | null
          updated_at?: string
          user_id: string
          value_proposition?: string | null
        }
        Update: {
          brand_competitors?: string | null
          brand_crisis?: string | null
          brand_differentials?: string | null
          brand_hashtags?: string | null
          brand_inspiration?: string | null
          brand_manual?: number | null
          brand_mission?: string | null
          brand_personality?: string | null
          brand_pillars?: string | null
          brand_promise?: string | null
          brand_voice?: string | null
          created_at?: string
          current_objective?: string | null
          id?: never
          important_dates?: string | null
          influencers_action?: number | null
          is_deleted?: number
          name?: string
          numeric_target?: string | null
          reference_contents?: string | null
          relevant_content?: string | null
          restrictions?: string | null
          target_audience?: string | null
          team_id?: number | null
          updated_at?: string
          user_id?: string
          value_proposition?: string | null
        }
        Relationships: []
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
          id: number
          is_deleted: number
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
          id?: never
          is_deleted?: number
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
          id?: never
          is_deleted?: number
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
          content_text: string
          content_video_url: string | null
          created_at: string
          engagement_tips: string | null
          id: number
          improvement_suggestions: string | null
          is_deleted: number
          negative_points: string | null
          overall_score: number | null
          platform: string | null
          positive_points: string | null
          review_type: string | null
          team_id: number | null
          theme_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          brand_id?: number | null
          content_image_url?: string | null
          content_text: string
          content_video_url?: string | null
          created_at?: string
          engagement_tips?: string | null
          id?: never
          improvement_suggestions?: string | null
          is_deleted?: number
          negative_points?: string | null
          overall_score?: number | null
          platform?: string | null
          positive_points?: string | null
          review_type?: string | null
          team_id?: number | null
          theme_id?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          brand_id?: number | null
          content_image_url?: string | null
          content_text?: string
          content_video_url?: string | null
          created_at?: string
          engagement_tips?: string | null
          id?: never
          improvement_suggestions?: string | null
          is_deleted?: number
          negative_points?: string | null
          overall_score?: number | null
          platform?: string | null
          positive_points?: string | null
          review_type?: string | null
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
          created_at: string
          feeling: string | null
          format: string | null
          id: number
          image_url: string | null
          is_deleted: number
          is_promote: number | null
          main_message: string | null
          micro_result: string
          next_step: string | null
          persona_id: number | null
          platform: string | null
          response_ai: string | null
          scheduled_for: string | null
          status: string | null
          team_id: number | null
          theme_id: number | null
          updated_at: string
          user_id: string
          visual_reference: number | null
        }
        Insert: {
          brand_id?: number | null
          content_type?: string | null
          created_at?: string
          feeling?: string | null
          format?: string | null
          id?: never
          image_url?: string | null
          is_deleted?: number
          is_promote?: number | null
          main_message?: string | null
          micro_result?: string
          next_step?: string | null
          persona_id?: number | null
          platform?: string | null
          response_ai?: string | null
          scheduled_for?: string | null
          status?: string | null
          team_id?: number | null
          theme_id?: number | null
          updated_at?: string
          user_id: string
          visual_reference?: number | null
        }
        Update: {
          brand_id?: number | null
          content_type?: string | null
          created_at?: string
          feeling?: string | null
          format?: string | null
          id?: never
          image_url?: string | null
          is_deleted?: number
          is_promote?: number | null
          main_message?: string | null
          micro_result?: string
          next_step?: string | null
          persona_id?: number | null
          platform?: string | null
          response_ai?: string | null
          scheduled_for?: string | null
          status?: string | null
          team_id?: number | null
          theme_id?: number | null
          updated_at?: string
          user_id?: string
          visual_reference?: number | null
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
            foreignKeyName: "contents_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
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
          beliefs: string | null
          brand_id: number | null
          buy_journey: string | null
          challenge: string | null
          content_habit: string | null
          created_at: string
          favorite_voice: string | null
          gender: string | null
          id: number
          interest_trigger: string | null
          interests: string[] | null
          is_deleted: number
          location: string | null
          main_objective: string | null
          name: string
          pain_points: string[] | null
          position_degree: string | null
          preferred_platforms: string[] | null
          team_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          beliefs?: string | null
          brand_id?: number | null
          buy_journey?: string | null
          challenge?: string | null
          content_habit?: string | null
          created_at?: string
          favorite_voice?: string | null
          gender?: string | null
          id?: never
          interest_trigger?: string | null
          interests?: string[] | null
          is_deleted?: number
          location?: string | null
          main_objective?: string | null
          name: string
          pain_points?: string[] | null
          position_degree?: string | null
          preferred_platforms?: string[] | null
          team_id?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          beliefs?: string | null
          brand_id?: number | null
          buy_journey?: string | null
          challenge?: string | null
          content_habit?: string | null
          created_at?: string
          favorite_voice?: string | null
          gender?: string | null
          id?: never
          interest_trigger?: string | null
          interests?: string[] | null
          is_deleted?: number
          location?: string | null
          main_objective?: string | null
          name?: string
          pain_points?: string[] | null
          position_degree?: string | null
          preferred_platforms?: string[] | null
          team_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personas_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      planning: {
        Row: {
          add_info: string | null
          brand_id: number
          created_at: string
          id: number
          is_deleted: number
          platform: string
          posts_number: number
          response_ai: string | null
          team_id: number | null
          theme_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          add_info?: string | null
          brand_id: number
          created_at?: string
          id?: never
          is_deleted?: number
          platform: string
          posts_number?: number
          response_ai?: string | null
          team_id?: number | null
          theme_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          add_info?: string | null
          brand_id?: number
          created_at?: string
          id?: never
          is_deleted?: number
          platform?: string
          posts_number?: number
          response_ai?: string | null
          team_id?: number | null
          theme_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          brands_limit: number
          content_limit: number
          created_at: string
          id: number
          is_deleted: number
          members_limit: number
          name: string
          personas_limit: number
          plan_type: string
          planning_limit: number
          price: number
          review_limit: number
          themes_limit: number
          updated_at: string
        }
        Insert: {
          brands_limit?: number
          content_limit?: number
          created_at?: string
          id?: never
          is_deleted?: number
          members_limit?: number
          name: string
          personas_limit?: number
          plan_type: string
          planning_limit?: number
          price?: number
          review_limit?: number
          themes_limit?: number
          updated_at?: string
        }
        Update: {
          brands_limit?: number
          content_limit?: number
          created_at?: string
          id?: never
          is_deleted?: number
          members_limit?: number
          name?: string
          personas_limit?: number
          plan_type?: string
          planning_limit?: number
          price?: number
          review_limit?: number
          themes_limit?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_team_id: number | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_team_id?: number | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_team_id?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          brand_id: number
          created_at: string
          ia_text: string
          id: number
          is_deleted: number
          response_ai: string | null
          team_id: number | null
          theme_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_id: number
          created_at?: string
          ia_text: string
          id?: never
          is_deleted?: number
          response_ai?: string | null
          team_id?: number | null
          theme_id?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_id?: number
          created_at?: string
          ia_text?: string
          id?: never
          is_deleted?: number
          response_ai?: string | null
          team_id?: number | null
          theme_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitations: {
        Row: {
          created_at: string
          id: number
          is_deleted: number
          status: number
          team_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          is_deleted?: number
          status?: number
          team_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          is_deleted?: number
          status?: number
          team_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          ends_at: string | null
          id: number
          plan_id: number | null
          started_at: string
          status: string
          team_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: never
          plan_id?: number | null
          started_at?: string
          status?: string
          team_id?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: never
          plan_id?: number | null
          started_at?: string
          status?: string
          team_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          created_at: string
          id: number
          status: Database["public"]["Enums"]["invitation_status"]
          team_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          status?: Database["public"]["Enums"]["invitation_status"]
          team_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          status?: Database["public"]["Enums"]["invitation_status"]
          team_id?: number
          updated_at?: string
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
          {
            foreignKeyName: "team_invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: number
          role: Database["public"]["Enums"]["team_role"]
          status: Database["public"]["Enums"]["member_status"]
          team_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          role?: Database["public"]["Enums"]["team_role"]
          status?: Database["public"]["Enums"]["member_status"]
          team_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          role?: Database["public"]["Enums"]["team_role"]
          status?: Database["public"]["Enums"]["member_status"]
          team_id?: number
          updated_at?: string
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
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          admin_user_id: string
          created_at: string
          id: number
          is_deleted: number
          name: string
          team_code: string
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          id?: never
          is_deleted?: number
          name: string
          team_code: string
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          id?: never
          is_deleted?: number
          name?: string
          team_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          add_info: string | null
          brand_id: number | null
          colors: string | null
          created_at: string
          description: string | null
          hashtags: string[] | null
          id: number
          is_deleted: number
          objectives: string[] | null
          team_id: number | null
          title: string
          universe_target: string | null
          updated_at: string
          user_id: string
          voice_ai: string | null
        }
        Insert: {
          add_info?: string | null
          brand_id?: number | null
          colors?: string | null
          created_at?: string
          description?: string | null
          hashtags?: string[] | null
          id?: never
          is_deleted?: number
          objectives?: string[] | null
          team_id?: number | null
          title: string
          universe_target?: string | null
          updated_at?: string
          user_id: string
          voice_ai?: string | null
        }
        Update: {
          add_info?: string | null
          brand_id?: number | null
          colors?: string | null
          created_at?: string
          description?: string | null
          hashtags?: string[] | null
          id?: never
          is_deleted?: number
          objectives?: string[] | null
          team_id?: number | null
          title?: string
          universe_target?: string | null
          updated_at?: string
          user_id?: string
          voice_ai?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "themes_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_read_team_row: {
        Args: { _team_id: number; _user_id: string }
        Returns: boolean
      }
      is_team_admin: {
        Args: { _team_id: number; _user_id: string }
        Returns: boolean
      }
      is_team_member: {
        Args: { _team_id: number; _user_id: string }
        Returns: boolean
      }
      shares_team_with: { Args: { _other: string }; Returns: boolean }
    }
    Enums: {
      invitation_status: "pending" | "approved" | "rejected"
      member_status: "pending" | "active" | "rejected"
      team_role: "admin" | "member"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      invitation_status: ["pending", "approved", "rejected"],
      member_status: ["pending", "active", "rejected"],
      team_role: ["admin", "member"],
    },
  },
} as const
