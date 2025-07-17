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
          createdAt: string
          id: number
          isDeleted: number
          name: string
          teamId: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: number
          isDeleted?: number
          name: string
          teamId: number
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: number
          isDeleted?: number
          name?: string
          teamId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Brand_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
        ]
      }
      Content: {
        Row: {
          brandId: number
          createdAt: string
          feeling: string
          format: string
          id: number
          isDeleted: number
          isPromote: number
          mainMessage: string
          microResult: string
          nextStep: string
          personaId: number | null
          responseAI: string
          teamId: number
          themeId: number
          updatedAt: string
          userId: number
          visualReference: number
        }
        Insert: {
          brandId: number
          createdAt?: string
          feeling: string
          format: string
          id?: number
          isDeleted?: number
          isPromote: number
          mainMessage: string
          microResult: string
          nextStep: string
          personaId?: number | null
          responseAI: string
          teamId: number
          themeId: number
          updatedAt?: string
          userId: number
          visualReference: number
        }
        Update: {
          brandId?: number
          createdAt?: string
          feeling?: string
          format?: string
          id?: number
          isDeleted?: number
          isPromote?: number
          mainMessage?: string
          microResult?: string
          nextStep?: string
          personaId?: number | null
          responseAI?: string
          teamId?: number
          themeId?: number
          updatedAt?: string
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
          createdAt: string
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
          createdAt?: string
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
          createdAt?: string
          dueDate?: string | null
          id?: number
          paymentId?: number | null
          status?: string
          stripeInvoiceId?: string
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Invoice_paymentId_fkey"
            columns: ["paymentId"]
            isOneToOne: false
            referencedRelation: "Payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Invoice_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Payment: {
        Row: {
          amount: number
          createdAt: string
          currency: string
          description: string | null
          id: number
          paidAt: string | null
          paymentMethod: string | null
          receiptUrl: string | null
          refunded: number
          status: string
          stripeChargeId: string | null
          stripePaymentIntent: string
          userId: number
        }
        Insert: {
          amount: number
          createdAt?: string
          currency: string
          description?: string | null
          id?: number
          paidAt?: string | null
          paymentMethod?: string | null
          receiptUrl?: string | null
          refunded?: number
          status: string
          stripeChargeId?: string | null
          stripePaymentIntent: string
          userId: number
        }
        Update: {
          amount?: number
          createdAt?: string
          currency?: string
          description?: string | null
          id?: number
          paidAt?: string | null
          paymentMethod?: string | null
          receiptUrl?: string | null
          refunded?: number
          status?: string
          stripeChargeId?: string | null
          stripePaymentIntent?: string
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Payment_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Permission: {
        Row: {
          id: number
          permission: string
          value: number
        }
        Insert: {
          id?: number
          permission: string
          value: number
        }
        Update: {
          id?: number
          permission?: string
          value?: number
        }
        Relationships: []
      }
      Persona: {
        Row: {
          age: string
          brandId: number
          challenge: string
          consumeHabit: string
          createdAt: string
          gender: string
          goals: string
          hobbies: string
          id: number
          isDeleted: number
          location: string
          name: string
          positionDegree: string
          teamId: number
          updatedAt: string
        }
        Insert: {
          age: string
          brandId: number
          challenge: string
          consumeHabit: string
          createdAt?: string
          gender: string
          goals: string
          hobbies: string
          id?: number
          isDeleted?: number
          location: string
          name: string
          positionDegree: string
          teamId: number
          updatedAt?: string
        }
        Update: {
          age?: string
          brandId?: number
          challenge?: string
          consumeHabit?: string
          createdAt?: string
          gender?: string
          goals?: string
          hobbies?: string
          id?: number
          isDeleted?: number
          location?: string
          name?: string
          positionDegree?: string
          teamId?: number
          updatedAt?: string
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
          createdAt: string
          id: number
          isDeleted: number
          membersLimit: number
          name: string
          personasLimit: number
          planningLimit: number
          price: number
          reviewLimit: number
          themesLimit: number
          updatedAt: string
        }
        Insert: {
          brandsLimit: number
          contentLimit: number
          createdAt?: string
          id?: number
          isDeleted?: number
          membersLimit: number
          name: string
          personasLimit: number
          planningLimit: number
          price: number
          reviewLimit: number
          themesLimit: number
          updatedAt?: string
        }
        Update: {
          brandsLimit?: number
          contentLimit?: number
          createdAt?: string
          id?: number
          isDeleted?: number
          membersLimit?: number
          name?: string
          personasLimit?: number
          planningLimit?: number
          price?: number
          reviewLimit?: number
          themesLimit?: number
          updatedAt?: string
        }
        Relationships: []
      }
      Planning: {
        Row: {
          addInfo: string
          brandId: number
          createdAt: string
          id: number
          isDeleted: number
          platform: string
          postsNumber: number
          responseAI: string
          teamId: number
          themeId: number
          updatedAt: string
          userId: number
        }
        Insert: {
          addInfo: string
          brandId: number
          createdAt?: string
          id?: number
          isDeleted?: number
          platform: string
          postsNumber: number
          responseAI: string
          teamId: number
          themeId: number
          updatedAt?: string
          userId: number
        }
        Update: {
          addInfo?: string
          brandId?: number
          createdAt?: string
          id?: number
          isDeleted?: number
          platform?: string
          postsNumber?: number
          responseAI?: string
          teamId?: number
          themeId?: number
          updatedAt?: string
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Planning_brandId_fkey"
            columns: ["brandId"]
            isOneToOne: false
            referencedRelation: "Brand"
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
          refundedAt: string
          stripeRefundId: string
        }
        Insert: {
          amount: number
          id?: number
          paymentId: number
          reason?: string | null
          refundedAt?: string
          stripeRefundId: string
        }
        Update: {
          amount?: number
          id?: number
          paymentId?: number
          reason?: string | null
          refundedAt?: string
          stripeRefundId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Refund_paymentId_fkey"
            columns: ["paymentId"]
            isOneToOne: false
            referencedRelation: "Payment"
            referencedColumns: ["id"]
          },
        ]
      }
      Review: {
        Row: {
          brandId: number
          createdAt: string
          iaText: string
          id: number
          isDeleted: number
          responseAI: string
          teamId: number
          updatedAt: string
          userId: number
        }
        Insert: {
          brandId: number
          createdAt?: string
          iaText: string
          id?: number
          isDeleted?: number
          responseAI: string
          teamId: number
          updatedAt?: string
          userId: number
        }
        Update: {
          brandId?: number
          createdAt?: string
          iaText?: string
          id?: number
          isDeleted?: number
          responseAI?: string
          teamId?: number
          updatedAt?: string
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
        Relationships: [
          {
            foreignKeyName: "Subscription_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Team: {
        Row: {
          accessCode: string
          createdAt: string
          id: number
          isDeleted: number
          nameTeam: string
          updatedAt: string
        }
        Insert: {
          accessCode: string
          createdAt?: string
          id?: number
          isDeleted?: number
          nameTeam: string
          updatedAt?: string
        }
        Update: {
          accessCode?: string
          createdAt?: string
          id?: number
          isDeleted?: number
          nameTeam?: string
          updatedAt?: string
        }
        Relationships: []
      }
      TeamPlan: {
        Row: {
          createdAt: string
          endDate: string
          id: number
          isDeleted: number
          planId: number
          teamId: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          endDate: string
          id?: number
          isDeleted?: number
          planId: number
          teamId: number
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          endDate?: string
          id?: number
          isDeleted?: number
          planId?: number
          teamId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "TeamPlan_planId_fkey"
            columns: ["planId"]
            isOneToOne: false
            referencedRelation: "Plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TeamPlan_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
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
          createdAt: string
          description: string
          hashtags: string
          id: number
          isDeleted: number
          objectives: string
          teamId: number
          title: string
          universeTarget: string
          updatedAt: string
          voiceAI: string
        }
        Insert: {
          addInfo: string
          brandId: number
          colors: string
          createdAt?: string
          description: string
          hashtags: string
          id?: number
          isDeleted?: number
          objectives: string
          teamId: number
          title: string
          universeTarget: string
          updatedAt?: string
          voiceAI: string
        }
        Update: {
          addInfo?: string
          brandId?: number
          colors?: string
          createdAt?: string
          description?: string
          hashtags?: string
          id?: number
          isDeleted?: number
          objectives?: string
          teamId?: number
          title?: string
          universeTarget?: string
          updatedAt?: string
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
          createdAt: string
          email: string
          id: number
          isDeleted: number
          password: string
          roleUser: number | null
          stateUser: string
          stripeCustomerId: string | null
          teamId: number | null
          updatedAt: string
          userName: string
        }
        Insert: {
          cityUser: string
          createdAt?: string
          email: string
          id?: number
          isDeleted?: number
          password: string
          roleUser?: number | null
          stateUser: string
          stripeCustomerId?: string | null
          teamId?: number | null
          updatedAt: string
          userName: string
        }
        Update: {
          cityUser?: string
          createdAt?: string
          email?: string
          id?: number
          isDeleted?: number
          password?: string
          roleUser?: number | null
          stateUser?: string
          stripeCustomerId?: string | null
          teamId?: number | null
          updatedAt?: string
          userName?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_roleUser_fkey"
            columns: ["roleUser"]
            isOneToOne: false
            referencedRelation: "Permission"
            referencedColumns: ["id"]
          },
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
