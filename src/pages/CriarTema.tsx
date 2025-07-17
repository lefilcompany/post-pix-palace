import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Palette, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function CriarTema() {
  const [tema, setTema] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    corPrimaria: "#3b82f6",
    corSecundaria: "#6366f1",
    estilo: "",
    palavrasChave: [] as string[],
  });

  const [novaPalavra, setNovaPalavra] = useState("");

  const adicionarPalavraChave = () => {
    if (novaPalavra.trim() && !tema.palavrasChave.includes(novaPalavra.trim())) {
      setTema(prev => ({
        ...prev,
        palavrasChave: [...prev.palavrasChave, novaPalavra.trim()]
      }));
      setNovaPalavra("");
    }
  };

  const removerPalavraChave = (palavra: string) => {
    setTema(prev => ({
      ...prev,
      palavrasChave: prev.palavrasChave.filter(p => p !== palavra)
    }));
  };

  const salvarTema = () => {
    if (!tema.nome || !tema.descricao || !tema.categoria) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Aqui você salvaria o tema no backend
    toast.success("Tema criado com sucesso!");
    
    // Reset form
    setTema({
      nome: "",
      descricao: "",
      categoria: "",
      corPrimaria: "#3b82f6",
      corSecundaria: "#6366f1",
      estilo: "",
      palavrasChave: [],
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criar Tema</h1>
          <p className="text-muted-foreground">Defina temas visuais para seus posts</p>
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
              <Label htmlFor="nome">Nome do Tema *</Label>
              <Input
                id="nome"
                value={tema.nome}
                onChange={(e) => setTema(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Verão Tropical"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select 
                value={tema.categoria} 
                onValueChange={(value) => setTema(prev => ({ ...prev, categoria: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporativo">Corporativo</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="elegante">Elegante</SelectItem>
                  <SelectItem value="moderno">Moderno</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="minimalista">Minimalista</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={tema.descricao}
                onChange={(e) => setTema(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o estilo e características do tema"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="corPrimaria">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="corPrimaria"
                    value={tema.corPrimaria}
                    onChange={(e) => setTema(prev => ({ ...prev, corPrimaria: e.target.value }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={tema.corPrimaria}
                    onChange={(e) => setTema(prev => ({ ...prev, corPrimaria: e.target.value }))}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="corSecundaria">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="corSecundaria"
                    value={tema.corSecundaria}
                    onChange={(e) => setTema(prev => ({ ...prev, corSecundaria: e.target.value }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={tema.corSecundaria}
                    onChange={(e) => setTema(prev => ({ ...prev, corSecundaria: e.target.value }))}
                    placeholder="#6366f1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estilo">Estilo Visual</Label>
              <Select 
                value={tema.estilo} 
                onValueChange={(value) => setTema(prev => ({ ...prev, estilo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estilo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fotografico">Fotográfico</SelectItem>
                  <SelectItem value="ilustrativo">Ilustrativo</SelectItem>
                  <SelectItem value="grafico">Gráfico</SelectItem>
                  <SelectItem value="artistico">Artístico</SelectItem>
                  <SelectItem value="minimalista">Minimalista</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Palavras-chave</Label>
              <div className="flex gap-2">
                <Input
                  value={novaPalavra}
                  onChange={(e) => setNovaPalavra(e.target.value)}
                  placeholder="Adicionar palavra-chave"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarPalavraChave()}
                />
                <Button onClick={adicionarPalavraChave} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tema.palavrasChave.map((palavra, index) => (
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
                background: `linear-gradient(135deg, ${tema.corPrimaria}, ${tema.corSecundaria})`
              }}
            >
              {tema.nome || "Nome do Tema"}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Categoria:</span> {tema.categoria || "Não definida"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Estilo:</span> {tema.estilo || "Não definido"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Descrição:</span> {tema.descricao || "Não definida"}
              </div>
              {tema.palavrasChave.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Palavras-chave:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tema.palavrasChave.map((palavra, index) => (
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