
interface OpenAIImageRequest {
  title: string;
  content: string;
  tone: string;
  platform: string;
  targetAudience: string;
  keywords: string[];
  imageStyle: string;
  colors: string[];
}

interface OpenAIImageResponse {
  imageUrl: string;
}

export class OpenAIService {
  private apiKey: string = "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";
  private baseUrl: string = "https://api.openai.com/v1";

  async generateImage(request: OpenAIImageRequest): Promise<OpenAIImageResponse> {
    try {
      // Primeiro, usar GPT-4o para gerar um prompt melhor
      const enhancedPrompt = await this.generateEnhancedPrompt(request);
      
      console.log("Generating image with OpenAI DALL-E using GPT-4o enhanced prompt:", enhancedPrompt);
      
      // Fazer chamada para OpenAI DALL-E API com o prompt melhorado
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: enhancedPrompt,
          n: 1,
          size: this.getImageSize(request.platform),
          quality: "hd",
          style: request.imageStyle === 'fotografico' ? 'natural' : 'vivid'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;
      
      console.log("Generated image URL:", imageUrl);
      
      return { imageUrl };
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      throw new Error("Falha ao gerar imagem com OpenAI");
    }
  }

  private async generateEnhancedPrompt(request: OpenAIImageRequest): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Você é um especialista em criar prompts para geração de imagens DALL-E. Crie prompts detalhados, específicos e visualmente ricos."
            },
            {
              role: "user",
              content: this.createImagePrompt(request)
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI GPT-4o API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro ao gerar prompt melhorado:", error);
      // Fallback para o prompt original se GPT-4o falhar
      return this.createImagePrompt(request);
    }
  }

  private getImageSize(platform: string): string {
    switch (platform) {
      case 'instagram':
        return '1024x1024';
      case 'facebook':
        return '1024x1024';
      case 'linkedin':
        return '1024x1024';
      case 'twitter':
        return '1024x1024';
      case 'tiktok':
        return '1024x1024';
      default:
        return '1024x1024';
    }
  }

  private createImagePrompt(request: OpenAIImageRequest): string {
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

export const geminiService = new OpenAIService();
