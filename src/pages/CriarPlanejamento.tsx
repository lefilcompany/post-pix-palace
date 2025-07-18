import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Calendar, Target, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function CriarPlanejamento() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [themes, setThemes] = useState([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_audience: "",
    post_count: "",
    platforms: [],
    frequency: "",
    duration_days: "",
    content_types: [],
    objectives: [],
    brand_id: "",
    theme_id: ""
  });

  const platformOptions = [
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "twitter", label: "Twitter" },
    { id: "tiktok", label: "TikTok" },
    { id: "youtube", label: "YouTube" }
  ];

  const contentTypeOptions = [
    { id: "image", label: "Imagem" },
    { id: "video", label: "Vídeo" },
    { id: "text", label: "Texto" },
    { id: "carousel", label: "Carrossel" },
    { id: "story", label: "Story" },
    { id: "reel", label: "Reel" }
  ];

  const objectiveOptions = [
    { id: "awareness", label: "Consciência de Marca" },
    { id: "engagement", label: "Engajamento" },
    { id: "leads", label: "Geração de Leads" },
    { id: "sales", label: "Vendas" },
    { id: "retention", label: "Retenção" },
    { id: "community", label: "Comunidade" }
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

  const handleMultiSelect = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.brand_id || !formData.theme_id) {
      toast.error("Título, marca e tema são obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-content-plan', {
        body: {
          ...formData,
          team_id: profile.current_team_id,
          post_count: parseInt(formData.post_count) || 0,
          duration_days: parseInt(formData.duration_days) || 0
        }
      });

      if (error) throw error;

      toast.success("Planejamento criado com sucesso!");
      navigate("/planejamentos");
    } catch (error) {
      console.error('Error creating content plan:', error);
      toast.error("Erro ao criar planejamento: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Criar Planejamento de Conteúdo</h1>
        <p className="text-muted-foreground">
          Crie um planejamento detalhado para suas publicações e campanhas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalhes do Planejamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título do Planejamento *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ex: Campanha de Verão 2024"
                  required
                />
              </div>

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
                <Label htmlFor="post_count">Número de Posts</Label>
                <Input
                  id="post_count"
                  type="number"
                  value={formData.post_count}
                  onChange={(e) => handleInputChange("post_count", e.target.value)}
                  placeholder="Ex: 20"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="frequency">Frequência de Publicação</Label>
                <Select onValueChange={(value) => handleInputChange("frequency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="biweekly">Quinzenal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration_days">Duração (dias)</Label>
                <Input
                  id="duration_days"
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => handleInputChange("duration_days", e.target.value)}
                  placeholder="Ex: 30"
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva os objetivos e contexto do planejamento..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="target_audience">Público-Alvo</Label>
              <Textarea
                id="target_audience"
                value={formData.target_audience}
                onChange={(e) => handleInputChange("target_audience", e.target.value)}
                placeholder="Descreva o público-alvo para este planejamento..."
                rows={2}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4" />
                Plataformas
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {platformOptions.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={formData.platforms.includes(platform.id)}
                    onCheckedChange={(checked) => 
                      handleMultiSelect("platforms", platform.id, !!checked)
                    }
                    />
                    <Label htmlFor={platform.id} className="text-sm">
                      {platform.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4" />
                Tipos de Conteúdo
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {contentTypeOptions.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={formData.content_types.includes(type.id)}
                    onCheckedChange={(checked) => 
                      handleMultiSelect("content_types", type.id, !!checked)
                    }
                    />
                    <Label htmlFor={type.id} className="text-sm">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4" />
                Objetivos
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {objectiveOptions.map((objective) => (
                  <div key={objective.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={objective.id}
                      checked={formData.objectives.includes(objective.id)}
                    onCheckedChange={(checked) => 
                      handleMultiSelect("objectives", objective.id, !!checked)
                    }
                    />
                    <Label htmlFor={objective.id} className="text-sm">
                      {objective.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Planejamento"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}