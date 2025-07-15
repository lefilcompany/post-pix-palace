import { useState, useEffect } from "react";
import { PostForm } from "@/components/PostForm";
import { ImageViewer } from "@/components/ImageViewer";
import { EditChat } from "@/components/EditChat";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { ExamplePosts } from "@/components/ExamplePosts";
import { createOpenAIService, OpenAIService } from "@/services/openai";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

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

export default function PostGenerator() {
  const [apiKey, setApiKey] = useState<string>("");
  const [openAIService, setOpenAIService] = useState<OpenAIService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [postData, setPostData] = useState<PostFormData | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Verificar se existe uma chave da API salva no localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setOpenAIService(createOpenAIService(savedApiKey));
    }
  }, []);

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    setOpenAIService(createOpenAIService(key));
  };

  const handleGeneratePost = async (formData: PostFormData) => {
    if (!openAIService) {
      toast.error("Serviço OpenAI não configurado");
      return;
    }

    setIsLoading(true);
    setPostData(formData);

    try {
      const result = await openAIService.generateImage(formData);
      setGeneratedImage(result.imageUrl);
      setShowChat(true);
      toast.success("Post gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar post:", error);
      toast.error("Erro ao gerar o post. Verifique sua chave da API e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpdate = (newImageUrl: string) => {
    setGeneratedImage(newImageUrl);
    toast.success("Imagem atualizada com sucesso!");
  };

  const handleResetApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey("");
    setOpenAIService(null);
    setGeneratedImage("");
    setPostData(null);
    setShowChat(false);
  };

  if (!apiKey || !openAIService) {
    return <ApiKeyInput onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Marketing Post Generator</h1>
                <p className="text-sm text-muted-foreground">
                  Powered by OpenAI DALL-E 3
                </p>
              </div>
            </div>
            <button
              onClick={handleResetApiKey}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Alterar API Key
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card p-8 rounded-lg shadow-elegant text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Gerando seu post...</h3>
              <p className="text-muted-foreground">
                Isso pode levar alguns segundos. Por favor, aguarde.
              </p>
            </div>
          </div>
        )}

        {!generatedImage ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Crie Posts Incríveis com IA
              </h2>
              <p className="text-lg text-muted-foreground">
                Preencha o formulário abaixo para gerar um post personalizado para sua estratégia de marketing
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <PostForm onGenerate={handleGeneratePost} isLoading={isLoading} />
            </div>
            <ExamplePosts />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ImageViewer
                imageUrl={generatedImage}
                postData={postData!}
              />
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setGeneratedImage("");
                    setPostData(null);
                    setShowChat(false);
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-smooth font-medium"
                >
                  Criar Novo Post
                </button>
              </div>
            </div>

            {showChat && (
              <div className="xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)]">
                <EditChat
                  currentImageUrl={generatedImage}
                  onImageUpdate={handleImageUpdate}
                  openAIService={openAIService!}
                  postData={postData!}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}