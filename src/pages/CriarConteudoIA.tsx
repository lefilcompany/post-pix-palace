import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles, Image, Type, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function CriarConteudoIA() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [themes, setThemes] = useState([]);
  const [generatedContent, setGeneratedContent] = useState(null);
  
  const [formData, setFormData] = useState({
    main_message: "",
    feeling: "",
    format: "",
    content_type: "post",
    platform: "",
    brand_id: "",
    theme_id: "",
    generate_image: false,
    image_prompt: ""
  });

  const feelingOptions = [
    { id: "inspirational", label: "Inspiracional" },
    { id: "informative", label: "Informativo" },
    { id: "entertaining", label: "Divertido" },
    { id: "promotional", label: "Promocional" },
    { id: "educational", label: "Educativo" },
    { id: "emotional", label: "Emocional" }
  ];

  const formatOptions = [
    { id: "carousel", label: "Carrossel" },
    { id: "single-post", label: "Post Único" },
    { id: "story", label: "Story" },
    { id: "reel", label: "Reel" },
    { id: "video", label: "Vídeo" },
    { id: "text-only", label: "Apenas Texto" }
  ];

  const platformOptions = [
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "twitter", label: "Twitter" },
    { id: "tiktok", label: "TikTok" }
  ];

  const contentTypeOptions = [
    { id: "post", label: "Post" },
    { id: "story", label: "Story" },
    { id: "reel", label: "Reel" },
    { id: "carousel", label: "Carrossel" }
  ];

  useEffect(() => {
    if (user && profile?.current_team_id) {
      fetchBrands();
      fetchThemes();
    }
  }, [user, profile]);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .eq('team_id', profile.current_team_id);
      
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('id, title')
        .eq('team_id', profile.current_team_id);
      
      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      console.error('Error fetching themes:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.main_message || !formData.brand_id || !formData.theme_id || !formData.platform) {
      toast.error("Mensagem principal, marca, tema e plataforma são obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          ...formData,
          team_id: profile.current_team_id
        }
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      toast.success("Conteúdo gerado com sucesso!");
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error("Erro ao gerar conteúdo: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = async () => {
    if (!generatedContent) return;

    try {
      toast.success("Conteúdo salvo!");
      navigate("/dashboard");
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error("Erro ao salvar conteúdo");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Criar Conteúdo com IA</h1>
        <p className="text-muted-foreground">
          Gere conteúdo personalizado para suas redes sociais usando inteligência artificial
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Configurações do Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="main_message">Mensagem Principal *</Label>
                <Textarea
                  id="main_message"
                  value={formData.main_message}
                  onChange={(e) => handleInputChange("main_message", e.target.value)}
                  placeholder="Descreva a mensagem principal do seu conteúdo..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand_id">Marca *</Label>
                  <Select onValueChange={(value) => handleInputChange("brand_id", value)}>
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
                  <Label htmlFor="theme_id">Tema *</Label>
                  <Select onValueChange={(value) => handleInputChange("theme_id", value)}>
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

                <div>
                  <Label htmlFor="platform">Plataforma *</Label>
                  <Select onValueChange={(value) => handleInputChange("platform", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content_type">Tipo de Conteúdo</Label>
                  <Select onValueChange={(value) => handleInputChange("content_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypeOptions.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="feeling">Sentimento</Label>
                  <Select onValueChange={(value) => handleInputChange("feeling", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sentimento" />
                    </SelectTrigger>
                    <SelectContent>
                      {feelingOptions.map((feeling) => (
                        <SelectItem key={feeling.id} value={feeling.id}>
                          {feeling.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="format">Formato</Label>
                  <Select onValueChange={(value) => handleInputChange("format", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="generate_image"
                    checked={formData.generate_image}
                    onCheckedChange={(checked) => handleCheckboxChange("generate_image", !!checked)}
                  />
                  <Label htmlFor="generate_image" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Gerar imagem com IA
                  </Label>
                </div>

                {formData.generate_image && (
                  <div>
                    <Label htmlFor="image_prompt">Prompt para Imagem</Label>
                    <Textarea
                      id="image_prompt"
                      value={formData.image_prompt}
                      onChange={(e) => handleInputChange("image_prompt", e.target.value)}
                      placeholder="Descreva a imagem que você quer gerar..."
                      rows={2}
                    />
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando Conteúdo...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Conteúdo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conteúdo Gerado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Texto Gerado
                  </Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap text-sm">
                      {generatedContent.generated_text || generatedContent.response_ai}
                    </p>
                  </div>
                </div>

                {generatedContent.image_url && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Imagem Gerada
                    </Label>
                    <div className="mt-2">
                      <img 
                        src={generatedContent.image_url} 
                        alt="Imagem gerada"
                        className="w-full max-w-md mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={handleSaveContent} className="flex-1">
                    Salvar Conteúdo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/revisar-conteudo/${generatedContent.id}`)}
                    className="flex-1"
                  >
                    Revisar Conteúdo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Type className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Preencha o formulário e clique em "Gerar Conteúdo" para criar seu post
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}