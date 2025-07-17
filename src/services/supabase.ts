import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Brand = Tables<"Brand">;
export type BrandInsert = TablesInsert<"Brand">;
export type Content = Tables<"Content">;
export type ContentInsert = TablesInsert<"Content">;
export type Persona = Tables<"Persona">;
export type PersonaInsert = TablesInsert<"Persona">;
export type Theme = Tables<"Theme">;
export type ThemeInsert = TablesInsert<"Theme">;
export type User = Tables<"User">;
export type UserInsert = TablesInsert<"User">;
export type Team = Tables<"Team">;
export type TeamInsert = TablesInsert<"Team">;

// Tipos simplificados para criação
export type CreateBrandData = {
  name: string;
  valueProposition: string;
  brandPillars: string;
  brandMission: string;
  brandInspiration: string;
  currentObjective: string;
  numericTarget: string;
  restrictions: string;
  brandHashtags: string;
  referenceContents: string;
  importantDates: string;
  relevantContent: string;
  brandCrisis: string;
};

export type CreateThemeData = {
  title: string;
  description: string;
  colors: string;
  voiceAI: string;
  universeTarget: string;
  hashtags: string;
  objectives: string;
  addInfo: string;
};

export type CreatePersonaData = {
  name: string;
  age: string;
  positionDegree: string;
  location: string;
  beliefs: string;
  contentHabit: string;
  mainObjective: string;
  challenge: string;
  favoriteVoice: string;
  buyJourney: string;
  interestTrigger: string;
  gender: string;
};

export type CreateContentData = {
  brandId: number;
  themeId: number;
  personaId: number;
  isPromote: number;
  visualReference: number;
  microResult: string;
  mainMessage: string;
  feeling: string;
  format: string;
  nextStep: string;
  responseAI: string;
  imageUrl: string;
};

class SupabaseService {
  // Brands
  async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from("Brand")
      .select("*")
      .eq("isDeleted", 0);
    
    if (error) {
      console.error("Erro ao buscar marcas:", error);
      throw error;
    }
    
    return data || [];
  }

  async saveBrand(brand: CreateBrandData): Promise<Brand> {
    const brandData: BrandInsert = {
      ...brand,
      userId: 1, // TODO: Implementar autenticação
      teamId: 1, // TODO: Implementar seleção de equipe
      influencersAction: 0,
      brandManual: 0,
      isDeleted: 0,
    };

    const { data, error } = await supabase
      .from("Brand")
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
      .from("Brand")
      .update({ isDeleted: 1 })
      .eq("id", brandId);

    if (error) {
      console.error("Erro ao deletar marca:", error);
      throw error;
    }
  }

  // Themes
  async getThemes(): Promise<Theme[]> {
    const { data, error } = await supabase
      .from("Theme")
      .select("*")
      .eq("isDeleted", 0);
    
    if (error) {
      console.error("Erro ao buscar temas:", error);
      throw error;
    }
    
    return data || [];
  }

  async saveTheme(theme: CreateThemeData): Promise<Theme> {
    const themeData: ThemeInsert = {
      ...theme,
      brandId: 1, // TODO: Implementar seleção de marca
      teamId: 1, // TODO: Implementar seleção de equipe
      isDeleted: 0,
    };

    const { data, error } = await supabase
      .from("Theme")
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
      .from("Theme")
      .update({ isDeleted: 1 })
      .eq("id", themeId);

    if (error) {
      console.error("Erro ao deletar tema:", error);
      throw error;
    }
  }

  // Personas
  async getPersonas(): Promise<Persona[]> {
    const { data, error } = await supabase
      .from("Persona")
      .select("*")
      .eq("isDeleted", 0);
    
    if (error) {
      console.error("Erro ao buscar personas:", error);
      throw error;
    }
    
    return data || [];
  }

  async savePersona(persona: CreatePersonaData): Promise<Persona> {
    const personaData: PersonaInsert = {
      ...persona,
      brandId: 1, // TODO: Implementar seleção de marca
      teamId: 1, // TODO: Implementar seleção de equipe
      isDeleted: 0,
    };

    const { data, error } = await supabase
      .from("Persona")
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
      .from("Persona")
      .update({ isDeleted: 1 })
      .eq("id", personaId);

    if (error) {
      console.error("Erro ao deletar persona:", error);
      throw error;
    }
  }

  // Content
  async getContents(): Promise<Content[]> {
    const { data, error } = await supabase
      .from("Content")
      .select("*")
      .eq("isDeleted", 0);
    
    if (error) {
      console.error("Erro ao buscar conteúdos:", error);
      throw error;
    }
    
    return data || [];
  }

  async saveContent(content: CreateContentData): Promise<Content> {
    const contentData: ContentInsert = {
      ...content,
      userId: 1, // TODO: Implementar autenticação
      teamId: 1, // TODO: Implementar seleção de equipe
      isDeleted: 0,
    };

    const { data, error } = await supabase
      .from("Content")
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
      .from("Content")
      .select("*")
      .eq("id", id)
      .eq("isDeleted", 0)
      .single();

    if (error) {
      console.error("Erro ao buscar conteúdo:", error);
      return null;
    }

    return data;
  }

  async updateContent(id: number, updates: Partial<Content>): Promise<Content | null> {
    const { data, error } = await supabase
      .from("Content")
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
      .from("Content")
      .update({ isDeleted: 1 })
      .eq("id", contentId);

    if (error) {
      console.error("Erro ao deletar conteúdo:", error);
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService();