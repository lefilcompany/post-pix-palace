import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Save, Trash2, BarChart3 } from "lucide-react";
import { supabaseService, Planning, Brand, Theme } from "@/services/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Planejamentos() {
  const [planejamentos, setPlanejamentos] = useState<Planning[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand_id: "",
    theme_id: "",
    platform: "",
    posts_number: 5,
    add_info: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [planningsData, brandsData, themesData] = await Promise.all([
        supabaseService.getPlanning(),
        supabaseService.getBrands(),
        supabaseService.getThemes(),
      ]);
      setPlanejamentos(planningsData);
      setBrands(brandsData);
      setThemes(themesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brand_id || !formData.theme_id || !formData.platform) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const newPlanning = await supabaseService.savePlanning({
        brand_id: parseInt(formData.brand_id),
        theme_id: parseInt(formData.theme_id),
        team_id: 0, // Will be updated when team functionality is implemented
        platform: formData.platform,
        posts_number: formData.posts_number,
        add_info: formData.add_info,
      });
      
      setPlanejamentos(prev => [...prev, newPlanning]);
      
      // Reset form
      setFormData({
        brand_id: "",
        theme_id: "",
        platform: "",
        posts_number: 5,
        add_info: "",
      });
      
      setIsDialogOpen(false);
      toast.success("Planejamento criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar planejamento:", error);
      toast.error("Erro ao criar planejamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlanning = async (planningId: number) => {
    try {
      await supabaseService.deletePlanning(planningId);
      setPlanejamentos(prev => prev.filter(planning => planning.id !== planningId));
      toast.success("Planejamento removido com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar planejamento:", error);
      toast.error("Erro ao deletar planejamento");
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
      facebook: "bg-blue-600",
      linkedin: "bg-blue-700",
      twitter: "bg-sky-500",
      tiktok: "bg-black",
      youtube: "bg-red-600",
    };
    return colors[platform.toLowerCase()] || "bg-gray-500";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Planejamentos</h1>
            <p className="text-muted-foreground">
              Gerencie seus planejamentos de conteúdo
            </p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Planejamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Planejamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand_id">Marca *</Label>
                  <Select value={formData.brand_id} onValueChange={(value) => handleInputChange("brand_id", value)}>
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
                  <Label htmlFor="theme_id">Tema *</Label>
                  <Select value={formData.theme_id} onValueChange={(value) => handleInputChange("theme_id", value)}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Plataforma *</Label>
                  <Select value={formData.platform} onValueChange={(value) => handleInputChange("platform", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posts_number">Número de Posts</Label>
                  <Input
                    id="posts_number"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.posts_number}
                    onChange={(e) => handleInputChange("posts_number", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add_info">Informações Adicionais</Label>
                <Textarea
                  id="add_info"
                  value={formData.add_info}
                  onChange={(e) => handleInputChange("add_info", e.target.value)}
                  placeholder="Adicione detalhes específicos para este planejamento..."
                  rows={3}
                />
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
                    Criar Planejamento
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Planejamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planejamentos.length > 0 ? (
          planejamentos.map((planning) => (
            <Card key={planning.id} className="border-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${getPlatformColor(planning.platform)} flex items-center justify-center`}>
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{planning.platform}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {planning.posts_number} posts
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePlanning(planning.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Marca:</span> {(planning as any).brands?.name || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Tema:</span> {(planning as any).themes?.title || 'N/A'}
                  </div>
                  {planning.add_info && (
                    <div className="text-sm">
                      <span className="font-medium">Info:</span> {planning.add_info}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Criado em {new Date(planning.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum planejamento criado</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie seu primeiro planejamento para organizar melhor seus conteúdos
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Planejamento
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}