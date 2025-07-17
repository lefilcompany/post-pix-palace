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

export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

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
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'url',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao gerar imagem');
      }

      const data = await response.json();
      
      return {
        imageUrl: data.data[0].url,
        revisedPrompt: data.data[0].revised_prompt || prompt,
      };
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      throw error;
    }
  }

  async editImage(originalImageUrl: string, editPrompt: string): Promise<GenerateImageResponse> {
    // Para editar imagem, vamos criar uma nova com base no prompt de edição
    // O DALL-E 3 não suporta edição direta, então geramos uma nova imagem
    const prompt = `Based on the previous image, ${editPrompt}. Maintain the overall marketing design quality and professionalism. High quality, professional marketing design, visually appealing, modern, clean layout.`;
    
    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'url',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao editar imagem');
      }

      const data = await response.json();
      
      return {
        imageUrl: data.data[0].url,
        revisedPrompt: data.data[0].revised_prompt || prompt,
      };
    } catch (error) {
      console.error('Erro ao editar imagem:', error);
      throw error;
    }
  }

  async generateChatResponse(message: string, context: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente especializado em design e marketing digital. Ajude o usuário a editar e melhorar suas imagens de posts de marketing. Seja criativo, prestativo e dê sugestões específicas.',
            },
            {
              role: 'user',
              content: `Contexto: ${context}\n\nSolicitação: ${message}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao processar mensagem');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      throw error;
    }
  }
}

// Função para criar instância do serviço com chave da API
export const createOpenAIService = (apiKey: string): OpenAIService => {
  return new OpenAIService(apiKey);
};