
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { localStorageService } from "@/services/localStorage";
import { geminiService } from "@/services/gemini";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
  { value: "tiktok", label: "TikTok" },
];

const tones = [
  { value: "profissional", label: "Profissional" },
  { value: "casual", label: "Casual" },
  { value: "amigavel", label: "Amigável" },
  { value: "formal", label: "Formal" },
  { value: "criativo", label: "Criativo" },
  { value: "inspirador", label: "Inspirador" },
];

const imageStyles = [
  { value: "fotografico", label: "Fotográfico" },
  { value: "ilustracao", label: "Ilustração" },
  { value: "minimalista", label: "Minimalista" },
  { value: "moderno", label: "Moderno" },
  { value: "artistico", label: "Artístico" },
  { value: "corporativo", label: "Corporativo" },
];

export default function CriarConteudo() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newColor, setNewColor] = useState("");
  
  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    plataforma: "",
    tom: "",
    estilo_imagem: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.conteudo || !formData.plataforma) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      // Gerar imagem com Gemini
      const imageResponse = await geminiService.generateImage({
        title: formData.titulo,
        content: formData.conteudo,
        tone: formData.tom,
        platform: formData.plataforma,
        targetAudience: "Público geral",
        keywords,
        imageStyle: formData.estilo_imagem,
        colors,
      });

      // Salvar conteúdo
      const newContent = localStorageService.saveContent({
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        plataforma: formData.plataforma,
        marca_id: "",
        tema_id: "",
        persona_id: "",
        tom: formData.tom,
        palavras_chave: keywords,
        estilo_imagem: formData.estilo_imagem,
        cores: colors,
        imagem_url: imageResponse.imageUrl,
      });

      toast.success("Conteúdo criado com sucesso!");
      navigate(`/conteudo/${newContent.id}`);
    } catch (error) {
      console.error("Erro ao criar conteúdo:", error);
      toast.error("Erro ao criar conteúdo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Criar Conteúdo</h1>
            <p className="text-muted-foreground">
              Use IA para gerar conteúdo incrível para suas redes sociais
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Conteúdo</CardTitle>
          <CardDescription>
            Preencha os dados para gerar seu conteúdo personalizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  placeholder="Digite o título do conteúdo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plataforma">Plataforma *</Label>
                <Select value={formData.plataforma} onValueChange={(value) => handleInputChange("plataforma", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo *</Label>
              <Textarea
                id="conteudo"
                value={formData.conteudo}
                onChange={(e) => handleInputChange("conteudo", e.target.value)}
                placeholder="Descreva o conteúdo que deseja criar..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tom">Tom de Voz</Label>
                <Select value={formData.tom} onValueChange={(value) => handleInputChange("tom", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tom" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estilo">Estilo da Imagem</Label>
                <Select value={formData.estilo_imagem} onValueChange={(value) => handleInputChange("estilo_imagem", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Palavras-chave */}
            <div className="space-y-2">
              <Label>Palavras-chave</Label>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Adicionar palavra-chave"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" onClick={addKeyword}>Adicionar</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <Trash2 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cores */}
            <div className="space-y-2">
              <Label>Cores</Label>
              <div className="flex gap-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Adicionar cor (ex: azul, #FF0000)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                />
                <Button type="button" onClick={addColor}>Adicionar</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Badge key={color} variant="secondary" className="flex items-center gap-1">
                    {color}
                    <Trash2 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeColor(color)}
                    />
                  </Badge>
                ))}
              </div>
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
    </div>
  );
}
