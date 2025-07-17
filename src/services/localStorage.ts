
// Serviço para gerenciar dados no localStorage sem conexão com banco

export interface Brand {
  id: number;
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
  influencersAction: number;
  brandManual: number;
}

export interface Theme {
  id: number;
  brandId: number;
  title: string;
  description: string;
  colors: string;
  voiceAI: string;
  universeTarget: string;
  hashtags: string;
  objectives: string;
  addInfo: string;
}

export interface Persona {
  id: number;
  brandId: number;
  name: string;
  gender: string;
  age: string;
  location: string;
  positionDegree: string;
  beliefs: string;
  contentHabit: string;
  mainObjective: string;
  challenge: string;
  favoriteVoice: string;
  buyJourney: string;
  interestTrigger: string;
}

export interface Content {
  id: number;
  brandId: number;
  themeId: number;
  personaId?: number;
  microResult: string;
  mainMessage: string;
  feeling: string;
  format: string;
  nextStep: string;
  isPromote: number;
  visualReference: number;
  imageUrl: string;
  responseAI: string;
  createdAt: string;
}

class LocalStorageService {
  private getNextId(key: string): number {
    const items = this.getItems(key);
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

  private getItems(key: string): any[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItems(key: string, items: any[]): void {
    localStorage.setItem(key, JSON.stringify(items));
  }

  // Brands
  getBrands(): Brand[] {
    return this.getItems('brands');
  }

  createBrand(brandData: Omit<Brand, 'id'>): Brand {
    const brands = this.getBrands();
    const newBrand: Brand = {
      ...brandData,
      id: this.getNextId('brands')
    };
    brands.push(newBrand);
    this.setItems('brands', brands);
    return newBrand;
  }

  // Themes
  getThemes(brandId?: number): Theme[] {
    const themes = this.getItems('themes');
    return brandId ? themes.filter(theme => theme.brandId === brandId) : themes;
  }

  createTheme(themeData: Omit<Theme, 'id'>): Theme {
    const themes = this.getThemes();
    const newTheme: Theme = {
      ...themeData,
      id: this.getNextId('themes')
    };
    themes.push(newTheme);
    this.setItems('themes', themes);
    return newTheme;
  }

  // Personas
  getPersonas(brandId?: number): Persona[] {
    const personas = this.getItems('personas');
    return brandId ? personas.filter(persona => persona.brandId === brandId) : personas;
  }

  createPersona(personaData: Omit<Persona, 'id'>): Persona {
    const personas = this.getPersonas();
    const newPersona: Persona = {
      ...personaData,
      id: this.getNextId('personas')
    };
    personas.push(newPersona);
    this.setItems('personas', personas);
    return newPersona;
  }

  // Content
  getContents(): Content[] {
    return this.getItems('contents');
  }

  createContent(contentData: Omit<Content, 'id' | 'createdAt'>): Content {
    const contents = this.getContents();
    const newContent: Content = {
      ...contentData,
      id: this.getNextId('contents'),
      createdAt: new Date().toISOString()
    };
    contents.push(newContent);
    this.setItems('contents', contents);
    return newContent;
  }

  // Limpar todos os dados (útil para desenvolvimento)
  clearAll(): void {
    localStorage.removeItem('brands');
    localStorage.removeItem('themes');
    localStorage.removeItem('personas');
    localStorage.removeItem('contents');
  }
}

export const localStorageService = new LocalStorageService();
