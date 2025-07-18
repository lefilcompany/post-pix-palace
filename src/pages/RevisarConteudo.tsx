import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, Target, TrendingUp, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function RevisarConteudo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [themes, setThemes] = useState([]);
  const [review, setReview] = useState(null);
  
  const [formData, setFormData] = useState({
    content_text: "",
    content_image_url: "",
    content_video_url: "",
    review_type: "improvement",
    brand_id: "",
    theme_id: "",
    platform: ""
  });

  const reviewTypeOptions = [
    { id: "pre_publish", label: "Pré-publicação", description: "Análise antes de publicar" },
    { id: "improvement", label: "Melhorias", description: "Sugestões para otimizar" },
    { id: "engagement", label: "Engajamento", description: "Foco em aumentar interações" }
  ];

  const platformOptions = [
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "twitter", label: "Twitter" },
    { id: "tiktok", label: "TikTok" }
  ];

  useEffect(() => {
    if (user && profile?.current_team_id) {
      fetchBrands();
      fetchThemes();
      
      // Se tem um ID, buscar o conteúdo para revisar
      if (id) {
        fetchContent();
      }
    }
  }, [user, profile, id]);

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

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('id', parseInt(id || '0'))
        .single();
      
      if (error) throw error;
      
      setFormData({
        content_text: data.response_ai || "",
        content_image_url: data.image_url || "",
        content_video_url: "",
        review_type: "improvement",
        brand_id: data.brand_id?.toString() || "",
        theme_id: data.theme_id?.toString() || "",
        platform: data.platform || ""
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error("Erro ao carregar conteúdo");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content_text || !formData.brand_id || !formData.theme_id) {
      toast.error("Conteúdo, marca e tema são obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('review-content', {
        body: {
          ...formData,
          team_id: profile.current_team_id
        }
      });

      if (error) throw error;

      setReview(data.review);
      toast.success("Análise concluída!");
    } catch (error) {
      console.error('Error reviewing content:', error);
      toast.error("Erro ao revisar conteúdo: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 6) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Revisar Conteúdo</h1>
        <p className="text-muted-foreground">
          Analise e obtenha feedback detalhado sobre seu conteúdo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Conteúdo para Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="content_text">Texto do Conteúdo *</Label>
                <Textarea
                  id="content_text"
                  value={formData.content_text}
                  onChange={(e) => handleInputChange("content_text", e.target.value)}
                  placeholder="Cole aqui o texto do seu conteúdo..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content_image_url">URL da Imagem (opcional)</Label>
                <Textarea
                  id="content_image_url"
                  value={formData.content_image_url}
                  onChange={(e) => handleInputChange("content_image_url", e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content_video_url">URL do Vídeo (opcional)</Label>
                <Textarea
                  id="content_video_url"
                  value={formData.content_video_url}
                  onChange={(e) => handleInputChange("content_video_url", e.target.value)}
                  placeholder="https://exemplo.com/video.mp4"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand_id">Marca *</Label>
                  <Select onValueChange={(value) => handleInputChange("brand_id", value)} value={formData.brand_id}>
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
                  <Select onValueChange={(value) => handleInputChange("theme_id", value)} value={formData.theme_id}>
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
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select onValueChange={(value) => handleInputChange("platform", value)} value={formData.platform}>
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
                  <Label htmlFor="review_type">Tipo de Análise</Label>
                  <Select onValueChange={(value) => handleInputChange("review_type", value)} value={formData.review_type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {reviewTypeOptions.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    Analisar Conteúdo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resultado da Análise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Análise Completa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {review ? (
              <div className="space-y-6">
                {/* Pontuação Geral */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getScoreIcon(review.overall_score)}
                        <span className="text-sm font-medium">Pontuação Geral</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getScoreColor(review.overall_score)}`}>
                          {review.overall_score}
                        </span>
                        <span className="text-sm text-muted-foreground">/10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pontos Positivos */}
                {review.positive_points && (
                  <div>
                    <Label className="flex items-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Pontos Positivos
                    </Label>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 whitespace-pre-wrap">
                        {review.positive_points}
                      </p>
                    </div>
                  </div>
                )}

                {/* Pontos Negativos */}
                {review.negative_points && (
                  <div>
                    <Label className="flex items-center gap-2 text-red-600 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      Pontos a Melhorar
                    </Label>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800 whitespace-pre-wrap">
                        {review.negative_points}
                      </p>
                    </div>
                  </div>
                )}

                {/* Sugestões de Melhoria */}
                {review.improvement_suggestions && (
                  <div>
                    <Label className="flex items-center gap-2 text-blue-600 mb-2">
                      <Star className="h-4 w-4" />
                      Sugestões de Melhoria
                    </Label>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 whitespace-pre-wrap">
                        {review.improvement_suggestions}
                      </p>
                    </div>
                  </div>
                )}

                {/* Dicas de Engajamento */}
                {review.engagement_tips && (
                  <div>
                    <Label className="flex items-center gap-2 text-purple-600 mb-2">
                      <TrendingUp className="h-4 w-4" />
                      Dicas de Engajamento
                    </Label>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-800 whitespace-pre-wrap">
                        {review.engagement_tips}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={() => navigate("/dashboard")} variant="outline" className="flex-1">
                    Voltar ao Dashboard
                  </Button>
                  <Button onClick={() => navigate("/criar-conteudo")} className="flex-1">
                    Criar Novo Conteúdo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Preencha o formulário e clique em "Analisar Conteúdo" para obter feedback detalhado
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}