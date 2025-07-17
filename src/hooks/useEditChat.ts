import { useState, useCallback } from "react";
import { GeminiService } from "@/services/gemini";
import { toast } from "sonner";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PostData {
  title: string;
  content: string;
  platform: string;
  tone: string;
  keywords: string[];
  style?: string;
  targetAudience?: string;
  brandPersonality?: string;
  colorScheme?: string;
  callToAction?: string;
}

interface UseEditChatProps {
  geminiService: GeminiService;
  currentImageUrl: string;
  postData: PostData;
}

export function useEditChat({ geminiService, currentImageUrl, postData }: UseEditChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Estou aqui para ajudar você a editar sua imagem. Você pode pedir para alterar cores, adicionar elementos, mudar o estilo, ou fazer qualquer outra modificação. Como posso ajudar?',
      timestamp: new Date(),
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userMessage: string, onImageUpdate: (url: string) => void) => {
    if (!userMessage.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Gerar resposta do chat com contexto completo do formulário
      const context = `
CONTEXTO DO POST ORIGINAL:
- Título: ${postData.title}
- Conteúdo: ${postData.content}
- Plataforma: ${postData.platform}
- Tom: ${postData.tone}
- Palavras-chave: ${postData.keywords.join(', ')}
${postData.style ? `- Estilo: ${postData.style}` : ''}
${postData.targetAudience ? `- Público-alvo: ${postData.targetAudience}` : ''}
${postData.brandPersonality ? `- Personalidade da marca: ${postData.brandPersonality}` : ''}
${postData.colorScheme ? `- Esquema de cores: ${postData.colorScheme}` : ''}
${postData.callToAction ? `- Call to Action: ${postData.callToAction}` : ''}

IMPORTANTE: Lembre-se sempre dessas informações ao sugerir edições na imagem. Mantenha a coerência com o conceito original do post.`;
      
      const chatResponse = await geminiService.generateChatResponse(userMessage, context);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: chatResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Tentar editar a imagem se o prompt for específico para edição
      if (userMessage.toLowerCase().includes('mudar') || 
          userMessage.toLowerCase().includes('alterar') || 
          userMessage.toLowerCase().includes('adicionar') || 
          userMessage.toLowerCase().includes('remover') ||
          userMessage.toLowerCase().includes('cor') ||
          userMessage.toLowerCase().includes('estilo')) {
        
        try {
          const editResult = await geminiService.editImage(currentImageUrl, userMessage);
          onImageUpdate(editResult.imageUrl);
          
          // Adicionar mensagem de sucesso
          const successMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: 'Pronto! Sua imagem foi atualizada conforme solicitado. Você pode fazer mais alterações se desejar!',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, successMessage]);
        } catch (editError) {
          console.error('Erro ao editar imagem:', editError);
          const errorMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: 'Consegui processar sua solicitação, mas houve um problema ao gerar a nova imagem. Você pode tentar novamente com uma descrição mais específica.',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, errorMessage]);
        }
      }

    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      toast.error('Erro ao processar sua solicitação');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [geminiService, currentImageUrl, postData, isLoading]);

  return {
    messages,
    isLoading,
    sendMessage,
  };
}