import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, Bot, User, Wand2 } from "lucide-react";
import { useEditChat } from "@/hooks/useEditChat";
import { OpenAIService } from "@/services/openai";

interface EditChatProps {
  currentImageUrl: string;
  onImageUpdate: (newImageUrl: string) => void;
  openAIService: OpenAIService;
  postData: {
    title: string;
    content: string;
    platform: string;
    tone: string;
    keywords: string[];
  };
}

export function EditChat({ currentImageUrl, onImageUpdate, openAIService, postData }: EditChatProps) {
  const { messages, isLoading, sendMessage } = useEditChat({
    openAIService,
    currentImageUrl,
    postData,
  });
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const message = inputMessage;
    setInputMessage('');
    await sendMessage(message, onImageUpdate);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Mudar as cores para tons mais quentes",
    "Adicionar mais elementos visuais",
    "Tornar o design mais minimalista",
    "Alterar a tipografia",
    "Adicionar um fundo gradiente",
    "Melhorar o contraste"
  ];

  return (
    <Card className="shadow-elegant h-full flex flex-col">
      <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Wand2 size={20} />
          Editor de Imagem IA
        </CardTitle>
        <CardDescription className="text-white/90">
          Converse com a IA para editar sua imagem
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback>
                    <Bot size={16} className="text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 bg-secondary">
                  <AvatarFallback>
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback>
                  <Bot size={16} className="text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-secondary rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Processando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Ações rápidas */}
        <div className="px-4 py-2 border-t bg-muted/50">
          <p className="text-xs text-muted-foreground mb-2">Ações rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => setInputMessage(action)}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua solicitação de edição..."
              disabled={isLoading}
              className="flex-1 transition-smooth"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-primary hover:opacity-90 transition-smooth"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}