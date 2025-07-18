
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Palette, Plus, Save, Trash2, X } from "lucide-react";
import { supabaseService, Theme } from "@/services/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Temas() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    cor_primaria: "#3b82f6",
    cor_secundaria: "#6366f1",
    estilo: "",
    palavras_chave: [] as string[],
  });

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      const allThemes = await supabaseService.getThemes();
      setThemes(allThemes);
    } catch (error) {
      console.error("Erro ao carregar temas:", error);
      toast.error("Erro ao carregar temas");
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.palavras_chave.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        palavras_chave: [...prev.palavras_chave, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      palavras_chave: prev.palavras_chave.filter(k => k !== keyword)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.categoria) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const newTheme = await supabaseService.saveTheme({
        title: formData.nome,
        description: formData.descricao,
        voice_ai: formData.estilo || "Moderno",
        hashtags: formData.palavras_chave,
        objectives: [formData.categoria],
      });
      setThemes(prev => [...prev, newTheme]);
      
      // Reset form
      setFormData({
        nome: "",
        descricao: "",
        categoria: "",
        cor_primaria: "#3b82f6",
        cor_secundaria: "#6366f1",
        estilo: "",
        palavras_chave: [],
      });
      
      setIsDialogOpen(false);
      toast.success("Tema criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar tema:", error);
      toast.error("Erro ao criar tema. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTheme = async (themeId: number) => {
    try {
      await supabaseService.deleteTheme(themeId);
      setThemes(prev => prev.filter(theme => theme.id !== themeId));
      toast.success("Tema removido com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar tema:", error);
      toast.error("Erro ao deletar tema");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Temas</h1>
            <p className="text-muted-foreground">
              Gerencie os temas visuais para seus conteúdos
            </p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Tema
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Tema</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Tema *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Ex: Verão Tropical"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  placeholder="Descreva o estilo e características do tema"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cor_primaria">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="cor_primaria"
                      value={formData.cor_primaria}
                      onChange={(e) => handleInputChange("cor_primaria", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.cor_primaria}
                      onChange={(e) => handleInputChange("cor_primaria", e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="cor_secundaria"
                      value={formData.cor_secundaria}
                      onChange={(e) => handleInputChange("cor_secundaria", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.cor_secundaria}
                      onChange={(e) => handleInputChange("cor_secundaria", e.target.value)}
                      placeholder="#6366f1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estilo">Estilo Visual</Label>
                <Select value={formData.estilo} onValueChange={(value) => handleInputChange("estilo", value)}>
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
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Adicionar palavra-chave"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.palavras_chave.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {keyword}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-destructive/20"
                        onClick={() => removeKeyword(keyword)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Criar Tema
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Temas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.length > 0 ? (
          themes.map((theme) => (
            <Card key={theme.id} className="border-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div 
                       className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-primary"
                     >
                      <Palette className="h-5 w-5 text-white" />
                    </div>
                     <div>
                        <CardTitle className="text-lg">{theme.title}</CardTitle>
                         <Badge variant="secondary" className="text-xs">
                           {theme.voice_ai}
                         </Badge>
                     </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTheme(theme.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {theme.description}
                </p>
                 <div className="space-y-2">
                   {theme.voice_ai && (
                     <div className="text-sm">
                       <span className="font-medium">Tom:</span> {theme.voice_ai}
                     </div>
                   )}
                   {theme.hashtags && theme.hashtags.length > 0 && (
                     <div className="text-sm">
                       <span className="font-medium">Hashtags:</span> {theme.hashtags.join(', ')}
                     </div>
                   )}
                   {theme.objectives && theme.objectives.length > 0 && (
                     <div className="text-sm">
                       <span className="font-medium">Objetivos:</span> {theme.objectives.join(', ')}
                     </div>
                   )}
                  <div className="flex items-center gap-2 mt-3">
                     <div 
                       className="h-4 w-4 rounded-full border bg-primary"
                     />
                     <div 
                       className="h-4 w-4 rounded-full border bg-secondary"
                     />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Palette className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum tema criado</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie seu primeiro tema para personalizar o visual dos seus conteúdos
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Tema
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
