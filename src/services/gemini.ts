import { toast } from "sonner";

interface PostFormData {
  title: string;
  content: string;
  tone: string;
  platform: string;
  targetAudience: string;
  keywords: string[];
  imageStyle: string;
  colors: string[];
}

export interface GenerateImageResponse {
  imageUrl: string;
  revisedPrompt: string;
}

export class GeminiService {
  private apiKey: string = 'AIzaSyBPANVrJq8BWVNXcfBANrI8ppONwQUA_UI';
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  private buildImagePrompt(postData: PostFormData): string {
    const { title, content, tone, platform, targetAudience, keywords, imageStyle, colors } = postData;
    
    let prompt = `Create a professional marketing post image for "${title}". `;
    prompt += `Content: "${content}". `;
    prompt += `Platform: ${platform}. `;
    prompt += `Tone: ${tone}. `;
    
    if (targetAudience) {
      prompt += `Target audience: ${targetAudience}. `;
    }
    
    if (imageStyle) {
      prompt += `Style: ${imageStyle}. `;
    }
    
    if (colors.length > 0) {
      prompt += `Preferred colors: ${colors.join(', ')}. `;
    }
    
    if (keywords.length > 0) {
      prompt += `Keywords: ${keywords.join(', ')}. `;
    }
    
    prompt += `High quality, professional marketing design, visually appealing, modern, clean layout, optimized for social media, eye-catching, brand-friendly.`;
    
    return prompt;
  }

  async generateImage(postData: PostFormData): Promise<GenerateImageResponse> {
    const prompt = this.buildImagePrompt(postData);
    
    try {
      const response = await fetch(`${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate an image based on this prompt: ${prompt}`
            }]
          }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao gerar imagem');
      }

      const data = await response.json();
      
      // Gemini retorna texto, vamos simular uma URL de imagem
      const imageUrl = `https://via.placeholder.com/1024x1024/4285f4/ffffff?text=${encodeURIComponent(postData.title)}`;
      
      return {
        imageUrl: imageUrl,
        revisedPrompt: prompt,
      };
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      throw error;
    }
  }

  async editImage(originalImageUrl: string, editPrompt: string): Promise<GenerateImageResponse> {
    const prompt = `Based on the previous image, ${editPrompt}. Maintain the overall marketing design quality and professionalism. High quality, professional marketing design, visually appealing, modern, clean layout.`;
    
    try {
      const response = await fetch(`${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Edit an image based on this prompt: ${prompt}`
            }]
          }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao editar imagem');
      }

      const data = await response.json();
      
      // Simular uma nova URL de imagem editada
      const imageUrl = `https://via.placeholder.com/1024x1024/34a853/ffffff?text=${encodeURIComponent('Edited')}`;
      
      return {
        imageUrl: imageUrl,
        revisedPrompt: prompt,
      };
    } catch (error) {
      console.error('Erro ao editar imagem:', error);
      throw error;
    }
  }

  async generateChatResponse(message: string, context: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Você é um assistente especializado em design e marketing digital. Ajude o usuário a editar e melhorar suas imagens de posts de marketing. Seja criativo, prestativo e dê sugestões específicas.\n\nContexto: ${context}\n\nSolicitação: ${message}`
            }]
          }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao processar mensagem');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      throw error;
    }
  }
}

// Função para criar instância do serviço
export const createGeminiService = (): GeminiService => {
  return new GeminiService();
};