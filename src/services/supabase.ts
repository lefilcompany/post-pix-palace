import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

// Define types for database tables and their insert types
export type Brand = Tables<"brands">;
export type BrandInsert = TablesInsert<"brands">;
export type Content = Tables<"contents">;
export type ContentInsert = TablesInsert<"contents">;
export type Persona = Tables<"personas">;
export type PersonaInsert = TablesInsert<"personas">;
export type Theme = Tables<"themes">;
export type ThemeInsert = TablesInsert<"themes">;

// Create data types for forms
export type CreateBrandData = {
  name: string;
  value_proposition?: string;
  brand_pillars?: string;
  brand_mission?: string;
  brand_inspiration?: string;
  current_objective?: string;
  numeric_target?: string;
  restrictions?: string;
  brand_hashtags?: string;
  reference_contents?: string;
  important_dates?: string;
  relevant_content?: string;
  brand_crisis?: string;
  target_audience?: string;
  brand_personality?: string;
  brand_voice?: string;
  brand_competitors?: string;
  brand_differentials?: string;
  brand_promise?: string;
  influencers_action?: number;
  brand_manual?: number;
};

export type CreateThemeData = {
  title: string;
  description?: string;
  voice_ai?: string;
  hashtags?: string[];
  objectives?: string[];
  brand_id?: number;
  colors?: string;
  universe_target?: string;
  add_info?: string;
};

export type CreatePersonaData = {
  name: string;
  age?: number;
  position_degree?: string;
  location?: string;
  main_objective?: string;
  challenge?: string;
  interests?: string[];
  pain_points?: string[];
  preferred_platforms?: string[];
  brand_id?: number;
  gender?: string;
  beliefs?: string;
  content_habit?: string;
  favorite_voice?: string;
  buy_journey?: string;
  interest_trigger?: string;
};

export type CreateContentData = {
  micro_result: string;
  main_message?: string;
  feeling?: string;
  format?: string;
  image_url?: string;
  next_step?: string;
  response_ai?: string;
  brand_id?: number;
  theme_id?: number;
  persona_id?: number;
  content_type?: string;
  platform?: string;
  status?: string;
  is_promote?: number;
  visual_reference?: number;
  scheduled_for?: string;
};

// New types for additional tables
export type Plan = Tables<"plans">;
export type Subscription = Tables<"subscriptions">;
export type Planning = Tables<"planning">;
export type Review = Tables<"reviews">;
export type Solicitation = Tables<"solicitations">;

export type CreatePlanningData = {
  brand_id: number;
  theme_id: number;
  team_id: number;
  platform: string;
  posts_number: number;
  add_info?: string;
  response_ai?: string;
};

export type CreateReviewData = {
  brand_id: number;
  team_id: number;
  ia_text: string;
  response_ai?: string;
};

class SupabaseService {
  // Helper function to get current user ID
  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    return user.id;
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("user_id", userId)
      .eq("is_deleted", 0);
    
    if (error) {
      console.error("Erro ao buscar marcas:", error);
      throw error;
    }
    
    return data || [];
  }

  async saveBrand(brand: CreateBrandData): Promise<Brand> {
    const userId = await this.getCurrentUserId();
    const brandData: BrandInsert = {
      ...brand,
      user_id: userId,
      team_id: 0, // Will be updated when team functionality is implemented
    };

    const { data, error } = await supabase
      .from("brands")
      .insert(brandData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar marca:", error);
      throw error;
    }

    return data;
  }

  async deleteBrand(brandId: number): Promise<void> {
    const { error } = await supabase
      .from("brands")
      .update({ is_deleted: 1 })
      .eq("id", brandId);

    if (error) {
      console.error("Erro ao deletar marca:", error);
      throw error;
    }
  }

  // Themes
  async getThemes(): Promise<Theme[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from("themes")
      .select("*")
      .eq("user_id", userId);
    
    if (error) {
      console.error("Erro ao buscar temas:", error);
      throw error;
    }
    
    return data || [];
  }

  async saveTheme(theme: CreateThemeData): Promise<Theme> {
    const userId = await this.getCurrentUserId();
    const themeData: ThemeInsert = {
      ...theme,
      user_id: userId,
      team_id: 0, // Will be updated when team functionality is implemented
    };

    const { data, error } = await supabase
      .from("themes")
      .insert(themeData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar tema:", error);
      throw error;
    }

    return data;
  }

  async deleteTheme(themeId: number): Promise<void> {
    const { error } = await supabase
      .from("themes")
      .delete()
      .eq("id", themeId);

    if (error) {
      console.error("Erro ao deletar tema:", error);
      throw error;
    }
  }

  // Personas
  async getPersonas(): Promise<Persona[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from("personas")
      .select("*")
      .eq("user_id", userId);
    
    if (error) {
      console.error("Erro ao buscar personas:", error);
      throw error;
    }
    
    return data || [];
  }

  async savePersona(persona: CreatePersonaData): Promise<Persona> {
    const userId = await this.getCurrentUserId();
    const personaData: PersonaInsert = {
      ...persona,
      user_id: userId,
      team_id: 0, // Will be updated when team functionality is implemented
    };

    const { data, error } = await supabase
      .from("personas")
      .insert(personaData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar persona:", error);
      throw error;
    }

    return data;
  }

  async deletePersona(personaId: number): Promise<void> {
    const { error } = await supabase
      .from("personas")
      .delete()
      .eq("id", personaId);

    if (error) {
      console.error("Erro ao deletar persona:", error);
      throw error;
    }
  }

  // Content
  async getContents(): Promise<Content[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from("contents")
      .select("*")
      .eq("user_id", userId);
    
    if (error) {
      console.error("Erro ao buscar conteúdos:", error);
      throw error;
    }
    
    return data || [];
  }

  async saveContent(content: CreateContentData): Promise<Content> {
    const userId = await this.getCurrentUserId();
    const contentData: ContentInsert = {
      ...content,
      user_id: userId,
      team_id: 0, // Will be updated when team functionality is implemented
    };

    const { data, error } = await supabase
      .from("contents")
      .insert(contentData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar conteúdo:", error);
      throw error;
    }

    return data;
  }

  async getContentById(id: number): Promise<Content | null> {
    const { data, error } = await supabase
      .from("contents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar conteúdo:", error);
      return null;
    }

    return data;
  }

  async updateContent(id: number, updates: Partial<Content>): Promise<Content | null> {
    const { data, error } = await supabase
      .from("contents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar conteúdo:", error);
      return null;
    }

    return data;
  }

  async deleteContent(contentId: number): Promise<void> {
    const { error } = await supabase
      .from("contents")
      .delete()
      .eq("id", contentId);

    if (error) {
      console.error("Erro ao deletar conteúdo:", error);
      throw error;
    }
  }

  // Plans
  async getPlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_deleted", 0);
    
    if (error) {
      console.error("Erro ao buscar planos:", error);
      throw error;
    }
    
    return data || [];
  }

  // Planning
  async getPlanning(): Promise<Planning[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from("planning")
      .select("*, brands(name), themes(title)")
      .eq("user_id", userId)
      .eq("is_deleted", 0);
    
    if (error) {
      console.error("Erro ao buscar planejamentos:", error);
      throw error;
    }
    
    return data || [];
  }

  async savePlanning(planning: CreatePlanningData): Promise<Planning> {
    const userId = await this.getCurrentUserId();
    const planningData = {
      ...planning,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("planning")
      .insert(planningData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar planejamento:", error);
      throw error;
    }

    return data;
  }

  async deletePlanning(planningId: number): Promise<void> {
    const { error } = await supabase
      .from("planning")
      .update({ is_deleted: 1 })
      .eq("id", planningId);

    if (error) {
      console.error("Erro ao deletar planejamento:", error);
      throw error;
    }
  }

  // Reviews
  async getReviews(): Promise<Review[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from("reviews")
      .select("*, brands(name)")
      .eq("user_id", userId)
      .eq("is_deleted", 0);
    
    if (error) {
      console.error("Erro ao buscar reviews:", error);
      throw error;
    }
    
    return data || [];
  }

  async saveReview(review: CreateReviewData): Promise<Review> {
    const userId = await this.getCurrentUserId();
    const reviewData = {
      ...review,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("reviews")
      .insert(reviewData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar review:", error);
      throw error;
    }

    return data;
  }

  async deleteReview(reviewId: number): Promise<void> {
    const { error } = await supabase
      .from("reviews")
      .update({ is_deleted: 1 })
      .eq("id", reviewId);

    if (error) {
      console.error("Erro ao deletar review:", error);
      throw error;
    }
  }

  // Solicitations
  async getSolicitations(): Promise<Solicitation[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from("solicitations")
      .select("*, teams(name)")
      .eq("user_id", userId)
      .eq("is_deleted", 0);
    
    if (error) {
      console.error("Erro ao buscar solicitações:", error);
      throw error;
    }
    
    return data || [];
  }

  async saveSolicitation(teamId: number): Promise<Solicitation> {
    const userId = await this.getCurrentUserId();
    const solicitationData = {
      team_id: teamId,
      user_id: userId,
      status: 0, // pending
    };

    const { data, error } = await supabase
      .from("solicitations")
      .insert(solicitationData)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar solicitação:", error);
      throw error;
    }

    return data;
  }
}

export const supabaseService = new SupabaseService();