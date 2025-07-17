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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Brand: {
        Row: {
          brandCrisis: string
          brandHashtags: string
          brandInspiration: string
          brandManual: number
          brandMission: string
          brandPillars: string
          createdAt: string | null
          currentObjective: string
          id: number
          importantDates: string
          influencersAction: number
          isDeleted: number | null
          name: string
          numericTarget: string
          referenceContents: string
          relevantContent: string
          restrictions: string
          teamId: number
          updatedAt: string | null
          userId: number
          valueProposition: string
        }
        Insert: {
          brandCrisis: string
          brandHashtags: string
          brandInspiration: string
          brandManual: number
          brandMission: string
          brandPillars: string
          createdAt?: string | null
          currentObjective: string
          id?: number
          importantDates: string
          influencersAction: number
          isDeleted?: number | null
          name: string
          numericTarget: string
          referenceContents: string
          relevantContent: string
          restrictions: string
          teamId: number
          updatedAt?: string | null
          userId: number
          valueProposition: string
        }
        Update: {
          brandCrisis?: string
          brandHashtags?: string
          brandInspiration?: string
          brandManual?: number
          brandMission?: string
          brandPillars?: string
          createdAt?: string | null
          currentObjective?: string
          id?: number
          importantDates?: string
          influencersAction?: number
          isDeleted?: number | null
          name?: string
          numericTarget?: string
          referenceContents?: string
          relevantContent?: string
          restrictions?: string
          teamId?: number
          updatedAt?: string | null
          userId?: number
          valueProposition?: string
        }
        Relationships: [
          {
            foreignKeyName: "Brand_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Brand_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Content: {
        Row: {
          brandId: number
          createdAt: string | null
          feeling: string
          format: string
          id: number
          imageUrl: string | null
          isDeleted: number | null
          isPromote: number
          mainMessage: string
          microResult: string
          nextStep: string
          personaId: number | null
          responseAI: string
          teamId: number
          themeId: number
          updatedAt: string | null
          userId: number
          visualReference: number
        }
        Insert: {
          brandId: number
          createdAt?: string | null
          feeling: string
          format: string
          id?: number
          imageUrl?: string | null
          isDeleted?: number | null
          isPromote: number
          mainMessage: string
          microResult: string
          nextStep: string
          personaId?: number | null
          responseAI: string
          teamId: number
          themeId: number
          updatedAt?: string | null
          userId: number
          visualReference: number
        }
        Update: {
          brandId?: number
          createdAt?: string | null
          feeling?: string
          format?: string
          id?: number
          imageUrl?: string | null
          isDeleted?: number | null
          isPromote?: number
          mainMessage?: string
          microResult?: string
          nextStep?: string
          personaId?: number | null
          responseAI?: string
          teamId?: number
          themeId?: number
          updatedAt?: string | null
          userId?: number
          visualReference?: number
        }
        Relationships: [
          {
            foreignKeyName: "Content_brandId_fkey"
            columns: ["brandId"]
            isOneToOne: false
            referencedRelation: "Brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Content_personaId_fkey"
            columns: ["personaId"]
            isOneToOne: false
            referencedRelation: "Persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Content_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Content_themeId_fkey"
            columns: ["themeId"]
            isOneToOne: false
            referencedRelation: "Theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Content_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Invoice: {
        Row: {
          amountDue: number
          amountPaid: number
          createdAt: string | null
          dueDate: string | null
          id: number
          paymentId: number | null
          status: string
          stripeInvoiceId: string
          userId: number
        }
        Insert: {
          amountDue: number
          amountPaid: number
          createdAt?: string | null
          dueDate?: string | null
          id?: number
          paymentId?: number | null
          status: string
          stripeInvoiceId: string
          userId: number
        }
        Update: {
          amountDue?: number
          amountPaid?: number
          createdAt?: string | null
          dueDate?: string | null
          id?: number
          paymentId?: number | null
          status?: string
          stripeInvoiceId?: string
          userId?: number
        }
        Relationships: []
      }
      Payment: {
        Row: {
          amount: number
          createdAt: string | null
          currency: string
          description: string | null
          id: number
          paidAt: string | null
          paymentMethod: string | null
          receiptUrl: string | null
          refunded: number | null
          status: string
          stripeChargeId: string | null
          stripePaymentIntent: string
          userId: number
        }
        Insert: {
          amount: number
          createdAt?: string | null
          currency: string
          description?: string | null
          id?: number
          paidAt?: string | null
          paymentMethod?: string | null
          receiptUrl?: string | null
          refunded?: number | null
          status: string
          stripeChargeId?: string | null
          stripePaymentIntent: string
          userId: number
        }
        Update: {
          amount?: number
          createdAt?: string | null
          currency?: string
          description?: string | null
          id?: number
          paidAt?: string | null
          paymentMethod?: string | null
          receiptUrl?: string | null
          refunded?: number | null
          status?: string
          stripeChargeId?: string | null
          stripePaymentIntent?: string
          userId?: number
        }
        Relationships: []
      }
      Persona: {
        Row: {
          age: string
          beliefs: string
          brandId: number
          buyJourney: string
          challenge: string
          contentHabit: string
          createdAt: string | null
          favoriteVoice: string
          gender: string
          id: number
          interestTrigger: string
          isDeleted: number | null
          location: string
          mainObjective: string
          name: string
          positionDegree: string
          teamId: number
          updatedAt: string | null
        }
        Insert: {
          age: string
          beliefs: string
          brandId: number
          buyJourney: string
          challenge: string
          contentHabit: string
          createdAt?: string | null
          favoriteVoice: string
          gender: string
          id?: number
          interestTrigger: string
          isDeleted?: number | null
          location: string
          mainObjective: string
          name: string
          positionDegree: string
          teamId: number
          updatedAt?: string | null
        }
        Update: {
          age?: string
          beliefs?: string
          brandId?: number
          buyJourney?: string
          challenge?: string
          contentHabit?: string
          createdAt?: string | null
          favoriteVoice?: string
          gender?: string
          id?: number
          interestTrigger?: string
          isDeleted?: number | null
          location?: string
          mainObjective?: string
          name?: string
          positionDegree?: string
          teamId?: number
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Persona_brandId_fkey"
            columns: ["brandId"]
            isOneToOne: false
            referencedRelation: "Brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Persona_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
        ]
      }
      Plan: {
        Row: {
          brandsLimit: number
          contentLimit: number
          createdAt: string | null
          id: number
          isDeleted: number | null
          membersLimit: number
          name: string
          personasLimit: number
          planningLimit: number
          price: number
          reviewLimit: number
          themesLimit: number
          updatedAt: string | null
        }
        Insert: {
          brandsLimit: number
          contentLimit: number
          createdAt?: string | null
          id?: number
          isDeleted?: number | null
          membersLimit: number
          name: string
          personasLimit: number
          planningLimit: number
          price: number
          reviewLimit: number
          themesLimit: number
          updatedAt?: string | null
        }
        Update: {
          brandsLimit?: number
          contentLimit?: number
          createdAt?: string | null
          id?: number
          isDeleted?: number | null
          membersLimit?: number
          name?: string
          personasLimit?: number
          planningLimit?: number
          price?: number
          reviewLimit?: number
          themesLimit?: number
          updatedAt?: string | null
        }
        Relationships: []
      }
      Planning: {
        Row: {
          addInfo: string
          brandId: number
          createdAt: string | null
          id: number
          isDeleted: number | null
          platform: string
          postsNumber: number
          responseAI: string
          teamId: number
          themeId: number
          updatedAt: string | null
          userId: number
        }
        Insert: {
          addInfo: string
          brandId: number
          createdAt?: string | null
          id?: number
          isDeleted?: number | null
          platform: string
          postsNumber: number
          responseAI: string
          teamId: number
          themeId: number
          updatedAt?: string | null
          userId: number
        }
        Update: {
          addInfo?: string
          brandId?: number
          createdAt?: string | null
          id?: number
          isDeleted?: number | null
          platform?: string
          postsNumber?: number
          responseAI?: string
          teamId?: number
          themeId?: number
          updatedAt?: string | null
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Planning_brandId_fkey"
            columns: ["brandId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Planning_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Planning_themeId_fkey"
            columns: ["themeId"]
            isOneToOne: false
            referencedRelation: "Theme"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Planning_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Refund: {
        Row: {
          amount: number
          id: number
          paymentId: number
          reason: string | null
          refundedAt: string | null
          stripeRefundId: string
        }
        Insert: {
          amount: number
          id?: number
          paymentId: number
          reason?: string | null
          refundedAt?: string | null
          stripeRefundId: string
        }
        Update: {
          amount?: number
          id?: number
          paymentId?: number
          reason?: string | null
          refundedAt?: string | null
          stripeRefundId?: string
        }
        Relationships: []
      }
      Review: {
        Row: {
          brandId: number
          createdAt: string | null
          iaText: string
          id: number
          isDeleted: number | null
          responseAI: string
          teamId: number
          updatedAt: string | null
          userId: number
        }
        Insert: {
          brandId: number
          createdAt?: string | null
          iaText: string
          id?: number
          isDeleted?: number | null
          responseAI: string
          teamId: number
          updatedAt?: string | null
          userId: number
        }
        Update: {
          brandId?: number
          createdAt?: string | null
          iaText?: string
          id?: number
          isDeleted?: number | null
          responseAI?: string
          teamId?: number
          updatedAt?: string | null
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Review_brandId_fkey"
            columns: ["brandId"]
            isOneToOne: false
            referencedRelation: "Brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Review_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Review_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Solicitation: {
        Row: {
          createdAt: string | null
          id: number
          isDeleted: number | null
          status: string | null
          teamId: number
          updatedAt: string | null
          userId: number
        }
        Insert: {
          createdAt?: string | null
          id?: number
          isDeleted?: number | null
          status?: string | null
          teamId: number
          updatedAt?: string | null
          userId: number
        }
        Update: {
          createdAt?: string | null
          id?: number
          isDeleted?: number | null
          status?: string | null
          teamId?: number
          updatedAt?: string | null
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Solicitation_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Solicitation_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Subscription: {
        Row: {
          canceledAt: string | null
          currentPeriodEnd: string
          id: number
          planName: string
          startedAt: string
          status: string
          stripeSubscriptionId: string
          userId: number
        }
        Insert: {
          canceledAt?: string | null
          currentPeriodEnd: string
          id?: number
          planName: string
          startedAt: string
          status: string
          stripeSubscriptionId: string
          userId: number
        }
        Update: {
          canceledAt?: string | null
          currentPeriodEnd?: string
          id?: number
          planName?: string
          startedAt?: string
          status?: string
          stripeSubscriptionId?: string
          userId?: number
        }
        Relationships: []
      }
      Team: {
        Row: {
          accessCode: string
          createdAt: string | null
          id: number
          isDeleted: number | null
          nameTeam: string
          updatedAt: string | null
        }
        Insert: {
          accessCode: string
          createdAt?: string | null
          id?: number
          isDeleted?: number | null
          nameTeam: string
          updatedAt?: string | null
        }
        Update: {
          accessCode?: string
          createdAt?: string | null
          id?: number
          isDeleted?: number | null
          nameTeam?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      TeamPlan: {
        Row: {
          createdAt: string | null
          endDate: string
          id: number
          isDeleted: number | null
          planId: number
          teamId: number
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string | null
          endDate: string
          id?: number
          isDeleted?: number | null
          planId: number
          teamId: number
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string | null
          endDate?: string
          id?: number
          isDeleted?: number | null
          planId?: number
          teamId?: number
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TeamPlan_planId_fkey"
            columns: ["planId"]
            isOneToOne: true
            referencedRelation: "Plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TeamPlan_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: true
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
        ]
      }
      Theme: {
        Row: {
          addInfo: string
          brandId: number
          colors: string
          createdAt: string | null
          description: string
          hashtags: string
          id: number
          isDeleted: number | null
          objectives: string
          teamId: number
          title: string
          universeTarget: string
          updatedAt: string | null
          voiceAI: string
        }
        Insert: {
          addInfo: string
          brandId: number
          colors: string
          createdAt?: string | null
          description: string
          hashtags: string
          id?: number
          isDeleted?: number | null
          objectives: string
          teamId: number
          title: string
          universeTarget: string
          updatedAt?: string | null
          voiceAI: string
        }
        Update: {
          addInfo?: string
          brandId?: number
          colors?: string
          createdAt?: string | null
          description?: string
          hashtags?: string
          id?: number
          isDeleted?: number | null
          objectives?: string
          teamId?: number
          title?: string
          universeTarget?: string
          updatedAt?: string | null
          voiceAI?: string
        }
        Relationships: [
          {
            foreignKeyName: "Theme_brandId_fkey"
            columns: ["brandId"]
            isOneToOne: false
            referencedRelation: "Brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Theme_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          cityUser: string
          createdAt: string | null
          email: string
          id: number
          isDeleted: number | null
          password: string
          rolePermission: string | null
          roleValue: number | null
          stateUser: string
          stripeCustomerId: string | null
          teamId: number | null
          updatedAt: string | null
          userName: string
        }
        Insert: {
          cityUser: string
          createdAt?: string | null
          email: string
          id?: number
          isDeleted?: number | null
          password: string
          rolePermission?: string | null
          roleValue?: number | null
          stateUser: string
          stripeCustomerId?: string | null
          teamId?: number | null
          updatedAt?: string | null
          userName: string
        }
        Update: {
          cityUser?: string
          createdAt?: string | null
          email?: string
          id?: number
          isDeleted?: number | null
          password?: string
          rolePermission?: string | null
          roleValue?: number | null
          stateUser?: string
          stripeCustomerId?: string | null
          teamId?: number | null
          updatedAt?: string | null
          userName?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
        ]
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
