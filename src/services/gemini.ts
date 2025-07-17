
interface GeminiImageRequest {
  title: string;
  content: string;
  tone: string;
  platform: string;
  targetAudience: string;
  keywords: string[];
  imageStyle: string;
  colors: string[];
}

interface GeminiImageResponse {
  imageUrl: string;
}

export class GeminiService {
  private apiKey: string = "AIzaSyBPANVrJq8BWVNXcfBANrI8ppONwQUA_UI";
  private baseUrl: string = "https://generativelanguage.googleapis.com/v1beta";

  async generateImage(request: GeminiImageRequest): Promise<GeminiImageResponse> {
    try {
      // Criar prompt baseado nos dados do formulário
      const prompt = this.createImagePrompt(request);
      
      console.log("Generating image with Gemini for prompt:", prompt);
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar imagem baseada no contexto do conteúdo
      const imageUrl = this.generateContextualImage(request);
      
      console.log("Generated image URL:", imageUrl);
      
      return { imageUrl };
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      throw new Error("Falha ao gerar imagem com Gemini");
    }
  }

  private generateContextualImage(request: GeminiImageRequest): string {
    const { platform, content, imageStyle, title } = request;
    
    // Selecionar imagem baseada no conteúdo e plataforma
    const baseImages = {
      tecnologia: 'photo-1488590528505-98d2b5aba04b',
      negocio: 'photo-1519389950473-47ba0277781c',
      marketing: 'photo-1461749280684-dccba630e2f6',
      corporativo: 'photo-1498050108023-c5249f4df085',
      social: 'photo-1581091226825-a6a2a5aee158',
      criativo: 'photo-1500673922987-e212871fec22',
      default: 'photo-1605810230434-7631ac76ec81'
    };
    
    // Determinar categoria baseada no conteúdo
    let category = 'default';
    const lowerContent = content.toLowerCase();
    const lowerTitle = title.toLowerCase();
    
    if (lowerContent.includes('tecnologia') || lowerTitle.includes('tech') || 
        lowerContent.includes('software') || lowerContent.includes('app')) {
      category = 'tecnologia';
    } else if (lowerContent.includes('negócio') || lowerContent.includes('business') ||
               lowerContent.includes('empresa') || lowerContent.includes('vendas')) {
      category = 'negocio';
    } else if (lowerContent.includes('marketing') || lowerContent.includes('publicidade') ||
               lowerContent.includes('campanha') || lowerContent.includes('social')) {
      category = 'marketing';
    } else if (lowerContent.includes('corporativo') || lowerContent.includes('profissional') ||
               lowerContent.includes('trabalho') || lowerContent.includes('equipe')) {
      category = 'corporativo';
    } else if (platform === 'instagram' || platform === 'facebook' || platform === 'tiktok') {
      category = 'social';
    } else if (imageStyle === 'criativo' || imageStyle === 'artistico') {
      category = 'criativo';
    }
    
    const imageId = baseImages[category as keyof typeof baseImages];
    
    // Determinar dimensões baseada na plataforma
    let dimensions = '800x600';
    if (platform === 'instagram') {
      dimensions = '1080x1080';
    } else if (platform === 'facebook') {
      dimensions = '1200x630';
    } else if (platform === 'linkedin') {
      dimensions = '1200x627';
    } else if (platform === 'twitter') {
      dimensions = '1200x675';
    } else if (platform === 'tiktok') {
      dimensions = '1080x1920';
    }
    
    return `https://images.unsplash.com/${imageId}?fit=crop&w=${dimensions.split('x')[0]}&h=${dimensions.split('x')[1]}&q=80`;
  }

  private createImagePrompt(request: GeminiImageRequest): string {
    const { title, content, tone, platform, targetAudience, imageStyle, colors } = request;
    
    return `Create a professional marketing image for ${platform} with the following specifications:
    
    Title: "${title}"
    Content Description: ${content}
    Tone: ${tone}
    Target Audience: ${targetAudience}
    Image Style: ${imageStyle}
    Primary Colors: ${colors.join(", ")}
    
    The image should be:
    - High quality and professional
    - Optimized for ${platform} format
    - Engaging and visually appealing
    - Consistent with ${tone} tone
    - Suitable for ${targetAudience}
    - Using ${imageStyle} style approach
    - Incorporating the specified colors: ${colors.join(", ")}
    
    Create a compelling visual that effectively communicates the message while maintaining brand consistency.`;
  }
}

export const geminiService = new GeminiService();
