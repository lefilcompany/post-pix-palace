
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Loader2, Download, Share2 } from "lucide-react";
import { supabaseService, Content } from "@/services/supabase";
import { geminiService } from "@/services/gemini";
import { toast } from "sonner";

export default function VisualizarConteudo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      loadContent();
    }
  }, [id, navigate]);

  const loadContent = async () => {
    try {
      const foundContent = await supabaseService.getContentById(parseInt(id!));
      if (foundContent) {
        setContent(foundContent);
      } else {
        toast.error("Conteúdo não encontrado");
        navigate("/");
      }
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
      toast.error("Erro ao carregar conteúdo");
      navigate("/");
    }
  };

  const handleRegenerateImage = async () => {
    if (!content) return;

    setIsRegenerating(true);
    try {
      const prompt = editPrompt || `Regenerar imagem para o conteúdo: ${content.micro_result}`;
      
      const imageResponse = await geminiService.generateImage({
        title: content.micro_result,
        content: content.main_message + (editPrompt ? ` - Modificação: ${editPrompt}` : ""),
        tone: content.feeling,
        platform: content.format,
        targetAudience: "Público-alvo",
        keywords: [],
        imageStyle: "moderno",
        colors: [],
      });

      const updatedContent = await supabaseService.updateContent(content.id, {
        image_url: imageResponse.imageUrl,
      });

      if (updatedContent) {
        setContent(updatedContent);
        toast.success("Imagem regenerada com sucesso!");
        setEditPrompt("");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erro ao regenerar imagem:", error);
      toast.error("Erro ao regenerar imagem. Tente novamente.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownload = () => {
    if (content?.image_url) {
      const link = document.createElement('a');
      link.href = content.image_url;
      link.download = `${content.micro_result}.jpg`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (content) {
      try {
        await navigator.share({
          title: content.micro_result,
          text: content.main_message,
          url: content.image_url,
        });
      } catch (error) {
        // Fallback para cópia do link
        navigator.clipboard.writeText(content.image_url || "");
        toast.success("Link da imagem copiado para a área de transferência!");
      }
    }
  };

  if (!content) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{content.micro_result}</h1>
            <p className="text-muted-foreground">
              Criado em {new Date(content.created_at || "").toLocaleDateString()} para {content.format}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imagem Gerada */}
        <Card>
          <CardHeader>
            <CardTitle>Imagem Gerada</CardTitle>
            <CardDescription>
              Visualize e edite a imagem do seu conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={content.image_url || ""}
                    alt={content.micro_result}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              
              {/* Edição da imagem */}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {isEditing ? "Cancelar Edição" : "Editar Imagem"}
                </Button>

                {isEditing && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="edit-prompt">
                        Descreva as alterações desejadas
                      </Label>
                      <Input
                        id="edit-prompt"
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="Ex: tornar mais colorido, adicionar texto..."
                      />
                    </div>
                    
                    <Button
                      onClick={handleRegenerateImage}
                      disabled={isRegenerating}
                      className="w-full"
                    >
                      {isRegenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Regenerando...
                        </>
                      ) : (
                        "Regenerar Imagem"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes do Conteúdo */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Conteúdo</CardTitle>
            <CardDescription>
              Informações sobre o conteúdo criado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Conteúdo</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {content.main_message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Plataforma</Label>
                <Badge variant="secondary" className="mt-1">
                  {content.format}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Tom</Label>
                <Badge variant="outline" className="mt-1">
                  {content.feeling}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Próximo Passo</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {content.next_step}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Resposta da IA</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {content.response_ai}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
