import { useState, useEffect } from "react";
import { PostForm } from "@/components/PostForm";
import { ImageViewer } from "@/components/ImageViewer";
import { EditChat } from "@/components/EditChat";
import { ExamplePosts } from "@/components/ExamplePosts";
import { createOpenAIService, OpenAIService } from "@/services/openai";
import { supabase } from "@/integrations/supabase/client";
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

export default function CriarConteudo() {
  const [openAIService, setOpenAIService] = useState<OpenAIService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [postData, setPostData] = useState<PostFormData | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Usar a API key fixa fornecida
    const fixedApiKey = "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";
    setOpenAIService(createOpenAIService(fixedApiKey));
  }, []);

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
      
      // Salvar no Supabase
      await saveContentToSupabase(formData, result.imageUrl);
      
      toast.success("Conteúdo gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar conteúdo:", error);
      toast.error("Erro ao gerar o conteúdo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveContentToSupabase = async (formData: PostFormData, imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('Content')
        .insert({
          userId: 1, // Temporário - será substituído por auth real
          teamId: 1, // Temporário - será substituído por auth real
          brandId: 1, // Temporário - será substituído por seleção real
          themeId: 1, // Temporário - será substituído por seleção real
          personaId: 1, // Temporário - será substituído por seleção real
          isPromote: 0,
          visualReference: 1,
          microResult: imageUrl,
          mainMessage: formData.title,
          feeling: formData.tone,
          format: formData.platform,
          nextStep: formData.content,
          responseAI: JSON.stringify(formData),
        });

      if (error) {
        console.error("Erro ao salvar no Supabase:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro ao salvar conteúdo:", error);
      // Não exibir erro para o usuário para não atrapalhar a experiência
    }
  };

  const handleImageUpdate = (newImageUrl: string) => {
    setGeneratedImage(newImageUrl);
    toast.success("Imagem atualizada com sucesso!");
  };

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
                <h1 className="text-2xl font-bold">Criar Conteúdo</h1>
                <p className="text-sm text-muted-foreground">
                  Powered by OpenAI GPT-4o
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card p-8 rounded-lg shadow-elegant text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Gerando seu conteúdo...</h3>
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
                Crie Conteúdos Incríveis com IA
              </h2>
              <p className="text-lg text-muted-foreground">
                Preencha o formulário abaixo para gerar um conteúdo personalizado para sua estratégia de marketing
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
                  Criar Novo Conteúdo
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