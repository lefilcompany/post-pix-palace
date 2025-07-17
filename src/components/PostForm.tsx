import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2, X } from "lucide-react";
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

interface PostFormProps {
  onGenerate: (data: PostFormData) => void;
  isLoading: boolean;
}

export function PostForm({ onGenerate, isLoading }: PostFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    tone: "",
    platform: "",
    targetAudience: "",
    keywords: [],
    imageStyle: "",
    colors: [],
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.tone || !formData.platform) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    onGenerate(formData);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()]
      }));
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Criar Conteúdo Marketing</CardTitle>
        <CardDescription className="text-white/90">
          Preencha as informações para gerar seu conteúdo personalizado
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Conteúdo *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Lançamento do novo produto"
                className="transition-smooth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma *</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Descreva o conteúdo..."
              className="min-h-[100px] transition-smooth"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tone">Tom de Voz *</Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="amigavel">Amigável</SelectItem>
                  <SelectItem value="inspirador">Inspirador</SelectItem>
                  <SelectItem value="humoristico">Humorístico</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Público-Alvo</Label>
              <Input
                id="audience"
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                placeholder="Ex: Jovens de 18-35 anos"
                className="transition-smooth"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageStyle">Estilo da Imagem</Label>
            <Select value={formData.imageStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, imageStyle: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimalista">Minimalista</SelectItem>
                <SelectItem value="moderno">Moderno</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
                <SelectItem value="corporativo">Corporativo</SelectItem>
                <SelectItem value="artistico">Artístico</SelectItem>
                <SelectItem value="fotografico">Fotográfico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Palavras-chave</Label>
              <div className="flex gap-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Adicionar palavra-chave"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="transition-smooth"
                />
                <Button type="button" onClick={addKeyword} variant="outline">
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {keyword}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 h-auto p-0"
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cores Preferenciais</Label>
              <div className="flex gap-2">
                <Input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Ex: azul, vermelho, verde"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  className="transition-smooth"
                />
                <Button type="button" onClick={addColor} variant="outline">
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {color}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeColor(color)}
                      className="ml-1 h-auto p-0"
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Gerando Conteúdo..." : "Gerar Conteúdo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}