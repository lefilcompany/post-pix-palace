import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Palette, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { localStorageService, Brand } from "@/services/localStorage";

export default function CriarTema() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tema, setTema] = useState({
    brandId: "",
    title: "",
    description: "",
    colors: "",
    voiceAI: "",
    universeTarget: "",
    hashtags: "",
    objectives: "",
    addInfo: "",
  });

  const [novaPalavra, setNovaPalavra] = useState("");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    try {
      const data = localStorageService.getBrands();
      setBrands(data);
    } catch (error) {
      console.error("Erro ao buscar marcas:", error);
      toast.error("Erro ao carregar marcas");
    }
  };

  const adicionarPalavraChave = () => {
    if (novaPalavra.trim() && !palavrasChave.includes(novaPalavra.trim())) {
      setPalavrasChave(prev => [...prev, novaPalavra.trim()]);
      setNovaPalavra("");
    }
  };

  const removerPalavraChave = (palavra: string) => {
    setPalavrasChave(prev => prev.filter(p => p !== palavra));
  };

  const salvarTema = async () => {
    if (!tema.title.trim()) {
      toast.error("Por favor, insira o título do tema");
      return;
    }

    if (!tema.brandId) {
      toast.error("Por favor, selecione uma marca");
      return;
    }

    if (!tema.description.trim()) {
      toast.error("Por favor, insira a descrição do tema");
      return;
    }

    try {
      localStorageService.createTheme({
        brandId: parseInt(tema.brandId),
        title: tema.title,
        description: tema.description,
        colors: tema.colors || "#3b82f6, #6366f1",
        voiceAI: tema.voiceAI || "Profissional e engajador",
        universeTarget: tema.universeTarget || "Público geral",
        hashtags: palavrasChave.join(", "),
        objectives: tema.objectives || "Criar conteúdo visual atrativo",
        addInfo: tema.addInfo || "Informações adicionais sobre o tema"
      });

      toast.success("Tema criado com sucesso!");
      setTema({
        brandId: "",
        title: "",
        description: "",
        colors: "",
        voiceAI: "",
        universeTarget: "",
        hashtags: "",
        objectives: "",
        addInfo: "",
      });
      setPalavrasChave([]);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro inesperado");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criar Tema</h1>
          <p className="text-muted-foreground">Defina temas visuais para seus conteúdos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Informações do Tema</CardTitle>
            <CardDescription>
              Configure as características visuais do seu tema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandId">Marca *</Label>
              <Select value={tema.brandId} onValueChange={(value) => setTema(prev => ({ ...prev, brandId: value }))}>
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

            <div className="space-y-2">
              <Label htmlFor="title">Título do Tema *</Label>
              <Input
                id="title"
                value={tema.title}
                onChange={(e) => setTema(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Verão Tropical"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={tema.description}
                onChange={(e) => setTema(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o estilo e características do tema"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors">Paleta de Cores</Label>
              <Input
                id="colors"
                value={tema.colors}
                onChange={(e) => setTema(prev => ({ ...prev, colors: e.target.value }))}
                placeholder="Ex: #FF6B35, #004E89, #FFFFFF"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voiceAI">Tom de Voz da IA</Label>
              <Input
                id="voiceAI"
                value={tema.voiceAI}
                onChange={(e) => setTema(prev => ({ ...prev, voiceAI: e.target.value }))}
                placeholder="Ex: Profissional, descontraído, inspirador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="universeTarget">Universo Target</Label>
              <Input
                id="universeTarget"
                value={tema.universeTarget}
                onChange={(e) => setTema(prev => ({ ...prev, universeTarget: e.target.value }))}
                placeholder="Ex: Jovens adultos, Profissionais de tecnologia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Objetivos</Label>
              <Textarea
                id="objectives"
                value={tema.objectives}
                onChange={(e) => setTema(prev => ({ ...prev, objectives: e.target.value }))}
                placeholder="Quais são os objetivos deste tema?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Hashtags/Palavras-chave</Label>
              <div className="flex gap-2">
                <Input
                  value={novaPalavra}
                  onChange={(e) => setNovaPalavra(e.target.value)}
                  placeholder="Adicionar hashtag"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarPalavraChave()}
                />
                <Button onClick={adicionarPalavraChave} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {palavrasChave.map((palavra, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {palavra}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={() => removerPalavraChave(palavra)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addInfo">Informações Adicionais</Label>
              <Textarea
                id="addInfo"
                value={tema.addInfo}
                onChange={(e) => setTema(prev => ({ ...prev, addInfo: e.target.value }))}
                placeholder="Informações extras sobre o tema"
                rows={2}
              />
            </div>

            <Button onClick={salvarTema} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Tema
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Preview do Tema</CardTitle>
            <CardDescription>
              Visualize como seu tema ficará
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="aspect-square rounded-lg p-6 flex items-center justify-center text-white font-bold text-xl"
              style={{
                background: tema.colors ? `linear-gradient(135deg, ${tema.colors.split(',')[0]?.trim() || '#3b82f6'}, ${tema.colors.split(',')[1]?.trim() || '#6366f1'})` : 'linear-gradient(135deg, #3b82f6, #6366f1)'
              }}
            >
              {tema.title || "Nome do Tema"}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Marca:</span> {brands.find(b => b.id.toString() === tema.brandId)?.name || "Não selecionada"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Tom de Voz:</span> {tema.voiceAI || "Não definido"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Descrição:</span> {tema.description || "Não definida"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Universo Target:</span> {tema.universeTarget || "Não definido"}
              </div>
              {palavrasChave.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Hashtags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {palavrasChave.map((palavra, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {palavra}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
