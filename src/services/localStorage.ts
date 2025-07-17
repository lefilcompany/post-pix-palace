export interface Brand {
  id: string;
  nome: string;
  descricao: string;
  setor: string;
  publico_alvo: string;
  valores: string[];
  cores_primarias: string[];
  cores_secundarias: string[];
  tipografia: string;
  tom_voz: string;
  estilo_visual: string;
  created_at: string;
}

export interface Theme {
  id: string;
  nome: string;
  descricao: string;
  marca_id: string;
  cores_principais: string[];
  cores_secundarias: string[];
  tipografia_principal: string;
  tipografia_secundaria: string;
  estilo_visual: string;
  elementos_graficos: string[];
  created_at: string;
}

export interface Persona {
  id: string;
  nome: string;
  idade: number;
  profissao: string;
  marca_id: string;
  descricao: string;
  objetivos: string[];
  dores: string[];
  comportamentos: string[];
  canais_preferidos: string[];
  created_at: string;
}

export interface Content {
  id: string;
  titulo: string;
  conteudo: string;
  plataforma: string;
  marca_id: string;
  tema_id: string;
  persona_id: string;
  tom: string;
  palavras_chave: string[];
  estilo_imagem: string;
  cores: string[];
  imagem_url: string;
  created_at: string;
}

class LocalStorageService {
  // Brands
  getBrands(): Brand[] {
    const brands = localStorage.getItem('brands');
    return brands ? JSON.parse(brands) : [];
  }

  saveBrand(brand: Omit<Brand, 'id' | 'created_at'>): Brand {
    const brands = this.getBrands();
    const newBrand: Brand = {
      ...brand,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    brands.push(newBrand);
    localStorage.setItem('brands', JSON.stringify(brands));
    return newBrand;
  }

  // Themes
  getThemes(): Theme[] {
    const themes = localStorage.getItem('themes');
    return themes ? JSON.parse(themes) : [];
  }

  saveTheme(theme: Omit<Theme, 'id' | 'created_at'>): Theme {
    const themes = this.getThemes();
    const newTheme: Theme = {
      ...theme,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    themes.push(newTheme);
    localStorage.setItem('themes', JSON.stringify(themes));
    return newTheme;
  }

  // Personas
  getPersonas(): Persona[] {
    const personas = localStorage.getItem('personas');
    return personas ? JSON.parse(personas) : [];
  }

  savePersona(persona: Omit<Persona, 'id' | 'created_at'>): Persona {
    const personas = this.getPersonas();
    const newPersona: Persona = {
      ...persona,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    personas.push(newPersona);
    localStorage.setItem('personas', JSON.stringify(personas));
    return newPersona;
  }

  // Content
  getContents(): Content[] {
    const contents = localStorage.getItem('contents');
    return contents ? JSON.parse(contents) : [];
  }

  saveContent(content: Omit<Content, 'id' | 'created_at'>): Content {
    const contents = this.getContents();
    const newContent: Content = {
      ...content,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    contents.push(newContent);
    localStorage.setItem('contents', JSON.stringify(contents));
    return newContent;
  }

  getContentById(id: string): Content | undefined {
    const contents = this.getContents();
    return contents.find(content => content.id === id);
  }

  updateContent(id: string, updates: Partial<Content>): Content | null {
    const contents = this.getContents();
    const index = contents.findIndex(content => content.id === id);
    if (index !== -1) {
      contents[index] = { ...contents[index], ...updates };
      localStorage.setItem('contents', JSON.stringify(contents));
      return contents[index];
    }
    return null;
  }

  deleteBrand(brandId: string): void {
    const brands = this.getBrands();
    const updatedBrands = brands.filter(brand => brand.id !== brandId);
    localStorage.setItem('brands', JSON.stringify(updatedBrands));
  }

  deleteTheme(themeId: string): void {
    const themes = this.getThemes();
    const updatedThemes = themes.filter(theme => theme.id !== themeId);
    localStorage.setItem('themes', JSON.stringify(updatedThemes));
  }

  deletePersona(personaId: string): void {
    const personas = this.getPersonas();
    const updatedPersonas = personas.filter(persona => persona.id !== personaId);
    localStorage.setItem('personas', JSON.stringify(updatedPersonas));
  }

  deleteContent(contentId: string): void {
    const contents = this.getContents();
    const updatedContents = contents.filter(content => content.id !== contentId);
    localStorage.setItem('contents', JSON.stringify(updatedContents));
  }
}

export const localStorageService = new LocalStorageService();
