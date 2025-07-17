import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createGeminiService, GeminiService } from "@/services/gemini";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export default function CriarConteudo() {
  const [brands, setBrands] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [personas, setPersonas] = useState<any[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
  const [formData, setFormData] = useState({
    brandId: "",
    themeId: "",
    personaId: "",
    microResult: "",
    mainMessage: "",
    feeling: "",
    format: "",
    nextStep: "",
    isPromote: 0,
    visualReference: 1
  });

  useEffect(() => {
    fetchBrands();
    setGeminiService(createGeminiService());
  }, []);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("Brand")
        .select("*")
        .eq("isDeleted", 0);

      if (error) {
        console.error("Erro ao buscar marcas:", error);
      } else {
        setBrands(data || []);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const fetchThemes = async (brandId?: string) => {
    try {
      let query = supabase
        .from("Theme")
        .select("*")
        .eq("isDeleted", 0);
      
      if (brandId) {
        query = query.eq("brandId", parseInt(brandId));
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar temas:", error);
      } else {
        setThemes(data || []);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const fetchPersonas = async (brandId?: string) => {
    try {
      let query = supabase
        .from("Persona")
        .select("*")
        .eq("isDeleted", 0);
      
      if (brandId) {
        query = query.eq("brandId", parseInt(brandId));
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar personas:", error);
      } else {
        setPersonas(data || []);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleBrandChange = (brandId: string) => {
    setFormData(prev => ({ ...prev, brandId, themeId: "", personaId: "" }));
    setThemes([]);
    setPersonas([]);
    if (brandId) {
      fetchThemes(brandId);
      fetchPersonas(brandId);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneratePost = async () => {
    if (!formData.brandId || !formData.themeId) {
      toast.error("Por favor, selecione uma marca e um tema");
      return;
    }

    if (!formData.microResult.trim() || !formData.mainMessage.trim()) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      if (!geminiService) {
        toast.error("Serviço Gemini não configurado");
        return;
      }

      // Criar prompt baseado nos dados do formulário
      const prompt = `Criar uma imagem para um post de marketing:
      Micro resultado: ${formData.microResult}
      Mensagem principal: ${formData.mainMessage}
      Sentimento: ${formData.feeling}
      Formato: ${formData.format}
      Próximo passo: ${formData.nextStep}
      
      Estilo: moderno, profissional, para redes sociais, alta qualidade, visual atrativo.`;

      const result = await geminiService.generateImage({
        title: formData.microResult,
        content: formData.mainMessage,
        tone: formData.feeling,
        platform: formData.format,
        targetAudience: "",
        keywords: [],
        imageStyle: "professional",
        colors: []
      });
      
      setGeneratedImage(result.imageUrl);
      
      // Salvar no Supabase
      const { error } = await supabase
        .from("Content")
        .insert([
          {
            userId: 1, // Temporário
            teamId: 1, // Temporário
            brandId: parseInt(formData.brandId),
            themeId: parseInt(formData.themeId),
            personaId: formData.personaId ? parseInt(formData.personaId) : null,
            microResult: formData.microResult,
            mainMessage: formData.mainMessage,
            feeling: formData.feeling,
            format: formData.format,
            nextStep: formData.nextStep,
            isPromote: formData.isPromote,
            visualReference: formData.visualReference,
            responseAI: JSON.stringify(result),
            imageUrl: result.imageUrl
          }
        ]);

      if (error) {
        console.error("Erro ao salvar conteúdo:", error);
        toast.error("Erro ao salvar conteúdo no banco");
      } else {
        toast.success("Conteúdo gerado e salvo com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao gerar post:", error);
      toast.error("Erro ao gerar o post. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
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
                  Powered by Google Gemini
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
            
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Informações do Conteúdo</CardTitle>
                <CardDescription>
                  Configure os detalhes do seu conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brandId">Marca *</Label>
                    <Select value={formData.brandId} onValueChange={handleBrandChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="themeId">Tema *</Label>
                    <Select value={formData.themeId} onValueChange={(value) => handleInputChange("themeId", value)} disabled={!formData.brandId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tema" />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme.id} value={theme.id.toString()}>
                            {theme.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="personaId">Persona (Opcional)</Label>
                  <Select value={formData.personaId} onValueChange={(value) => handleInputChange("personaId", value)} disabled={!formData.brandId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id.toString()}>
                          {persona.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="microResult">Micro Resultado *</Label>
                  <Input
                    id="microResult"
                    value={formData.microResult}
                    onChange={(e) => handleInputChange("microResult", e.target.value)}
                    placeholder="Qual o micro resultado esperado?"
                  />
                </div>

                <div>
                  <Label htmlFor="mainMessage">Mensagem Principal *</Label>
                  <Textarea
                    id="mainMessage"
                    value={formData.mainMessage}
                    onChange={(e) => handleInputChange("mainMessage", e.target.value)}
                    placeholder="Qual a mensagem principal em 3 segundos?"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="feeling">Sentimento</Label>
                    <Input
                      id="feeling"
                      value={formData.feeling}
                      onChange={(e) => handleInputChange("feeling", e.target.value)}
                      placeholder="Que sentimento transmitir?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="format">Formato</Label>
                    <Select value={formData.format} onValueChange={(value) => handleInputChange("format", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carrossel">Carrossel</SelectItem>
                        <SelectItem value="stories">Stories</SelectItem>
                        <SelectItem value="feed">Feed</SelectItem>
                        <SelectItem value="video">Vídeo</SelectItem>
                        <SelectItem value="reels">Reels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="nextStep">Próximo Passo</Label>
                  <Input
                    id="nextStep"
                    value={formData.nextStep}
                    onChange={(e) => handleInputChange("nextStep", e.target.value)}
                    placeholder="Qual o próximo passo para o usuário?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="isPromote">Impulsionar</Label>
                    <Select value={formData.isPromote.toString()} onValueChange={(value) => handleInputChange("isPromote", parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Impulsionar post?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Não</SelectItem>
                        <SelectItem value="1">Sim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="visualReference">Referência Visual</Label>
                    <Select value={formData.visualReference.toString()} onValueChange={(value) => handleInputChange("visualReference", parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Incluir referência visual?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Não</SelectItem>
                        <SelectItem value="1">Sim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleGeneratePost} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Gerar Conteúdo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Conteúdo Gerado!</h2>
              <p className="text-lg text-muted-foreground">
                Seu conteúdo foi criado com sucesso
              </p>
            </div>
            
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center mb-6">
                  {generatedImage ? (
                    <img 
                      src={generatedImage} 
                      alt="Conteúdo gerado" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Sparkles className="h-12 w-12 mx-auto mb-2" />
                      <p>Imagem gerada</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Micro Resultado:</h3>
                    <p className="text-muted-foreground">{formData.microResult}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Mensagem Principal:</h3>
                    <p className="text-muted-foreground">{formData.mainMessage}</p>
                  </div>
                  {formData.feeling && (
                    <div>
                      <h3 className="font-semibold mb-2">Sentimento:</h3>
                      <p className="text-muted-foreground">{formData.feeling}</p>
                    </div>
                  )}
                  {formData.nextStep && (
                    <div>
                      <h3 className="font-semibold mb-2">Próximo Passo:</h3>
                      <p className="text-muted-foreground">{formData.nextStep}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={() => {
                      setGeneratedImage("");
                      setFormData({
                        brandId: "",
                        themeId: "",
                        personaId: "",
                        microResult: "",
                        mainMessage: "",
                        feeling: "",
                        format: "",
                        nextStep: "",
                        isPromote: 0,
                        visualReference: 1
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Criar Novo Conteúdo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}