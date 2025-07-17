
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
      
      // Por enquanto, vamos simular a geração de imagem retornando uma URL de placeholder
      // Em produção, você usaria a API real do Gemini
      const imageUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
      
      console.log("Generating image with Gemini for prompt:", prompt);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { imageUrl };
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      throw new Error("Falha ao gerar imagem com Gemini");
    }
  }

  private createImagePrompt(request: GeminiImageRequest): string {
    const { title, content, tone, platform, targetAudience, imageStyle, colors } = request;
    
    return `Crie uma imagem para ${platform} com o título "${title}". 
    Conteúdo: ${content}
    Tom: ${tone}
    Público-alvo: ${targetAudience}
    Estilo da imagem: ${imageStyle}
    Cores principais: ${colors.join(", ")}
    A imagem deve ser profissional e adequada para marketing digital.`;
  }
}

export const geminiService = new GeminiService();
